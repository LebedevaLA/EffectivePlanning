import { useState } from 'react'
import { ProjectModal } from './ProjectModal'
import { ProblemModal } from './ProblemModal'
import { DelayModal } from './DelayModal'
import { TaskModal } from './InBoxAddWindow'

export const UnloadModal = ({ 
  isOpen, 
  task, 
  onClose, 
  onCreateProject, 
  onCreateProblem, 
  onDelay,
  addTaskModule,
  onCloseAddTask,
  onAddTask
}) => {
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
    await onCreateProject(projectData)
    handleCloseSubModal()
  }
  
  const handleTaskSubmit = async (taskData) => {
    await onCreateProblem(taskData)
    handleCloseSubModal()
  }
  
  const handleDelaySubmit = async (delayUntil) => {
    await onDelay(delayUntil)
    handleCloseSubModal()
  }

  return (
    <>
      <div className="modal-overlay">
        <button 
          className='add-task-button' 
          onClick={onCloseAddTask}
        >
          Добавить дело в Inbox
        </button>
        
        <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
          <button 
            className="modal-close-button" 
            onClick={() => {
              const confirmDelete = window.confirm('Дело из инбокса будет удалено. Вы уверены?');
              if (confirmDelete) {
                onClose();
              }
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>
          <h2 className="modal-title">{task.text}</h2>
          <div className="buttons-container">
            <button 
              className="button-human" 
              onClick={handleProjectClick}
              disabled={!task.text.trim()}
            >
              Проект
            </button>
            <button 
              className="button-human" 
              onClick={handleTaskClick}
              disabled={!task.text.trim()}
            >
              Задача
            </button>
            <button 
              className="button-human" 
              onClick={handleDelayClick}
              disabled={!task.text.trim()}
            >
              Отложенная задача
            </button>
          </div>
        </div>
      </div>
      
      {subModalType === 'task' && (
        <ProblemModal
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
      
      <TaskModal 
        isOpen={addTaskModule}
        onClose={onCloseAddTask}
        onAdd={onAddTask}
      />
    </>
  )
}