import { useState, useEffect } from 'react'
import { ProblemModal } from './ProblemModal'
import { api } from '../services/api'

export const InfoProject = ({ isOpen, project, onClose, onProjectUpdate, initialSelectedTaskId }) => {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
    if (project) {
      setProjectName(project.name || '')
      setProjectDescription(project.description || '')
      setTasks(project.tasks || [])
      setSelectedTaskId(initialSelectedTaskId || null)
    }
  }, [project, initialSelectedTaskId])
  
  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      description: taskData.description,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
    console.log('Получена задача из TaskModal:', taskData)
    setIsTaskModalOpen(false)
  }
  
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null)
    }
  }
  
  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId)
    console.log('Выбрана задача:', taskId)
  }
  
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm('⚠️ Вы уверены, что хотите удалить проект? Все задачи проекта будут безвозвратно удалены.')
    
    if (confirmDelete) {
      setIsDeleting(true)
      try {
        await api.deleteProject(project.id)
        console.log('Проект удален:', project.id)
        
        alert('✅ Проект успешно удален)\nПоздаравляю с завершением Проекта 🎉 ')
        
        if (onProjectUpdate) {
          onProjectUpdate(project.id, null, true)
        }
        
        onClose()
      } catch (error) {
        console.error('Ошибка при удалении проекта:', error)
        alert('❌ Ошибка при удалении проекта')
      } finally {
        setIsDeleting(false)
      }
    }
  }
  
  const handleSaveAndClose = async () => {
    setIsSaving(true)
    try {
      const updatedProject = {
        ...project,
        name: projectName,
        description: projectDescription,
        tasks: tasks
      }
      
      await api.updateProject(project.id, updatedProject)
      console.log('Проект сохранен на бекенд:', updatedProject)
      console.log('Временный выбор задачи на фронте:', selectedTaskId)
      
      if (onProjectUpdate) {
        onProjectUpdate(project.id, selectedTaskId)
      }
      
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении проекта:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  if (!isOpen || !project) return null
  
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
          <button 
            className="modal-close-button" 
            onClick={handleSaveAndClose}
            disabled={isSaving}
          >
            ✕
          </button>
          
          <textarea
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Название проекта"
            rows={2}
            className='textarea_proj'
          />
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Описание проекта"
            rows={3}
            className='textarea_proj'
          />
          
          <div className="project-modal">
            {tasks.length > 0 && (
              <>
                <p style={{ color: 'var(--color-orange)' }}>Задачи проекта:</p>
                {tasks.map(task => {
                  const isActive = task.status === 'active'
                  const isCompleted = task.status === 'done'
                  
                  return (
                    <div key={task.id} className="problem_in_project" style={{
                      opacity: isCompleted ? 0.6 : 1
                    }}>
                      <input
                        type="radio"
                        name={`project-${project.id}-task`}
                        checked={selectedTaskId === task.id}
                        onChange={() => isActive && handleSelectTask(task.id)}
                        disabled={!isActive}
                        className="task-radio"
                        style={{ cursor: isActive ? 'pointer' : 'not-allowed' }}
                      />
                      <p style={{ 
                        flex: 1,
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        color: isCompleted ? '#999' : 'inherit'
                      }}>
                        {task.description}
                      </p>
                      <button 
                        className="del-problem" 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ opacity: isCompleted ? 0.5 : 1 }}
                        disabled={isCompleted}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </>
            )}
          </div>
          
          <div className="buttons-container" style={{ marginTop: '2rem' }}>
            <button 
              className="button-human" 
              onClick={() => setIsTaskModalOpen(true)}
            >
              Добавить задачу
            </button>
            <button 
              className="button-human button-danger" 
              onClick={handleDeleteProject}
              disabled={isDeleting}
              style={{ backgroundColor: '#ec5b00', color: 'var(--color-white)' }}
            >
              {isDeleting ? 'Удаление...' : 'Завершить проект'}
            </button>
          </div>
        </div>
      </div>
      
      <ProblemModal
        isOpen={isTaskModalOpen}
        taskText={`Задача в проекте ${projectName}`}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  )
}
