import { useState, useEffect } from 'react'
import { TaskModal } from './TaskModal'
import { api } from '../services/api'

export const InfoProject = ({ isOpen, project, onClose, onProjectUpdate }) => {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    if (project) {
      setProjectName(project.name || '')
      setProjectDescription(project.description || '')
      setTasks(project.tasks || [])
    }
  }, [project])
  
  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      description: taskData.description,
      createdAt: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
    console.log('Получена задача из TaskModal:', taskData)
    setIsTaskModalOpen(false)
  }
  
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    console.log('Удалена задача с id:', taskId)
  }
  
  const handleSaveAndClose = async () => {
    setIsSaving(true)
    try {
      // Обновляем проект с новыми задачами
      const updatedProject = {
        ...project,
        name: projectName,
        description: projectDescription,
        tasks: tasks
      }
      
      await api.updateProject(project.id, updatedProject)
      console.log('Проект сохранен:', updatedProject)
      
      // Обновляем список проектов в родительском компоненте
      if (onProjectUpdate) {
        await onProjectUpdate()
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
                {tasks.map(task => (
                  <div key={task.id} className="problem_in_project">
                    <p>{task.description}</p>
                    <button className="del-problem" onClick={() => handleDeleteTask(task.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="one-button-container">
            <button 
              className="button-human" 
              onClick={() => setIsTaskModalOpen(true)}
            >
              Добавить задачу
            </button>
          </div>
        </div>
      </div>
      
      <TaskModal
        isOpen={isTaskModalOpen}
        taskText={`Задача в проекте ${projectName}`}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  )
}