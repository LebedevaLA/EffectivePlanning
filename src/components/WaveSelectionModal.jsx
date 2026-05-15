import { useState, useEffect } from 'react'
import { api } from '../services/api'

export const WaveSelectionModal = ({ 
  isOpen, 
  onClose,
  initialSelections = {},
  setMode
}) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selections, setSelections] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadProjects()
    }
  }, [isOpen])

  useEffect(() => {
    if (Object.keys(initialSelections).length > 0) {
      setSelections(initialSelections)
    }
  }, [initialSelections])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const allProjects = await api.getAllProjects()
      setProjects(allProjects);
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskSelect = (projectId, taskId) => {
    setSelections(prev => ({
      ...prev,
      [projectId]: taskId
    }))
  }

  const handleSubmit = async () => {
    const missingProjects = projects.filter(p => !selections[p.id])
    
    if (missingProjects.length > 0) {
      const names = missingProjects.map(p => p.name).join(', ')
      alert(`⚠️ Для следующих проектов не выбрана задача: ${names}`)
      return
    }

    setSaving(true)
    try {
      for (const project of projects) {
        const selectedTaskId = selections[project.id]
        const selectedTask = project.tasks?.find(t => t.id === selectedTaskId)
        
        if (selectedTask) {
          await api.addToCurrentWave({
            projectId: project.id,
            projectName: project.name,
            problemId: selectedTask.id,
            problemDescription: selectedTask.description,
            selectedAt: new Date().toISOString()
          })
        }
      }
      const allProblems = await api.getAllProblems()
      for (const problem of allProblems) {
        await api.addToCurrentWave({
          problemId: problem.id,
          problemDescription: problem.description,
          selectedAt: new Date().toISOString(),
        })
        await api.deleteProblem(problem.id);
      }
      alert('✅ Задачи успешно отправлены в текущую волну!')
      setMode('do');
      onClose()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('❌ Ошибка при отправке задач')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="wave-modal-container">
        <div className="wave-modal-header">
          <h2>Выбор задач на текущую волну</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="wave-modal-content">
          {loading ? (
            <p>Загрузка проектов...</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="wave-project-card">
                <h3>{project.name || 'Без названия'}</h3>
                <p className="project-description">{project.description || 'Без описания'}</p>
                
                <div className="project-tasks-list">
                  <p className="tasks-label">Задачи проекта:</p>
                  {project.tasks?.length > 0 ? (
                    project.tasks?.filter(task => task.status === 'active')
                    .map(task => (
                      <label key={task.id} className="task-radio-item">
                        <input
                          type="radio"
                          name={`project-${project.id}`}
                          checked={selections[project.id] === task.id}
                          onChange={() => handleTaskSelect(project.id, task.id)}
                          className='task-radio'
                        />
                        <span>{task.description}</span>
                      </label>
                    ))
                  ) : (
                    <p className="no-tasks">Нет задач</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="wave-modal-footer">
          <button
            className="button-primary"
            onClick={handleSubmit}
            disabled={saving || loading}
          >
            {saving ? 'Отправка...' : 'Подтвердить выбор'}
          </button>
          <button className="button-secondary" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}