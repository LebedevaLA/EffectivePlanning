import { useState } from 'react'
import {TaskModal} from './InBoxAddWindow'
export const ProblemDescription = ({ isOpen, problem, onComplete, addTaskModule, onCloseAddTask, onAddTask }) => {
  if (!isOpen || !problem) return null;
  
  const handleComplete = () => {
    const confirmComplete = window.confirm('✅ Задача выполнена? Она будет отмечена как сделанная.');
    if (confirmComplete) {
      onComplete();
    }
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
            <div className="text-conteiner-do-problem">
              <p style={{ color: 'var(--color-purple)' }}>{problem.problemDescription}</p>
              {problem.projectName && (
                  <p style={{ color: 'var(--color-orange)' }}>
                      Из проекта: <strong>{problem.projectName}</strong>
                  </p>
              )}
            </div>
            <div className="one-button-container">
                <button 
                    className="button-human" 
                    onClick={handleComplete}
                >
                Сделано
                </button>
            </div>
            <TaskModal 
                    isOpen={addTaskModule}
                    onClose={onCloseAddTask}
                    onAdd={onAddTask}
                  />
        </div>
      </div>
    </>
  )
}