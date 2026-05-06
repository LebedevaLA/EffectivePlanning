// TaskModal.jsx
import { useState, useEffect } from 'react'

export const TaskModal = ({ isOpen, taskText, onClose, onSubmit }) => {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  
  useEffect(() => {
    if (!isOpen) {
      setTaskName('')
      setTaskDescription('')
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.trim()) {
      onSubmit({
        text: taskName.trim(),
        description: taskDescription.trim(),
        sourceText: taskText,
        status: 'inbox'
      })
      setTaskName('')
      setTaskDescription('')
    }
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-button" 
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>
        <h2 className="modal-title">{taskText}</h2>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="name-field"
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Название задачи..."
            rows={2}
            autoFocus
          />
          <textarea
            className="description-field"
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Опишите задачу..."
            rows={3}
            autoFocus
          />
          <div className="one-button-container">
            <button className = "button-human" disabled={!taskText.trim()}>
              Добавить Задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}