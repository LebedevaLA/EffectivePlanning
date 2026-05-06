// UnloadModal.jsx
import { useState } from 'react'
import { ProjectModal } from './ProjectModal'
import { TaskModal } from './TaskModal'
import { DelayModal } from './DelayModal'

export const UnloadModal = ({ isOpen, task, onClose, onDelete, onCreateProject, onCreateProblem, onDelay }) => {
  const [subModalType, setSubModalType] = useState(null)
  
  if (!isOpen || !task) return null;
  
  const handleProjectClick = () => {
    setSubModalType('project')
  }
  
  const handleTaskClick = () => {
    setSubModalType('task')
  }
  
  const handleDelayClick = () => {
    setSubModalType('delay')
  }
  
  const handleCloseSubModal = () => {
    setSubModalType(null)
  }
  const handleProjectSubmit = async (projectData) => {
    await onCreateProject(projectData)  // создаем проект для ЭТОГО дела
    handleCloseSubModal()  // ← возвращаемся в UnloadModal с ТЕМ ЖЕ делом
  }
  
  const handleTaskSubmit = async (taskData) => {
    await onCreateProblem(taskData)  // создаем задачу для ЭТОГО дела
    handleCloseSubModal()  // ← возвращаемся в UnloadModal с ТЕМ ЖЕ делом
  }
  
  const handleDelaySubmit = async (delayUntil) => {
    await onDelay(delayUntil)  // откладываем дело
    handleCloseSubModal()  // ← возвращаемся в UnloadModal с ТЕМ ЖЕ делом
  }
  
  return (
    <>
    <div className="modal-overlay">
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-button" 
          onClick={onDelete}
          aria-label="Закрыть"
        >
          ✕
        </button>
        <h2 className="modal-title">{task.text}</h2>
        <div className="buttons-container">
            <button className="button-human" 
              onClick={handleProjectClick}
              disabled={!task.text.trim()}>
              Проект
            </button>
            <button className="button-human" 
              onClick={handleTaskClick}
              disabled={!task.text.trim()}>
              Задача
            </button>
            <button className="button-human" 
              onClick={handleDelayClick}
              disabled={!task.text.trim()}>
              Отложенная задача
            </button>
          </div>
      </div>
    </div>
      {subModalType === 'task' && (
        <TaskModal
          isOpen={true}
          taskText={task.text}
          onClose={handleCloseSubModal}
          onSubmit={handleTaskSubmit}
        />
      )}
      {subModalType === 'project' && (
        <ProjectModal
          isOpen={true}
          taskText={task.text}
          onClose={handleCloseSubModal}
          onSubmit={handleProjectSubmit}
        />
      )}
      {subModalType === 'delay' && (
        <DelayModal
          isOpen={true}
          taskText={task.text}
          onClose={handleCloseSubModal}
          onSubmit={handleDelaySubmit}
        />
      )}
      
    </>
  )
}