import { useState, useEffect } from 'react'

export const ProblemModal = ({ isOpen, taskText, onClose, onSubmit }) => {
  const [taskDescription, setTaskDescription] = useState('')
  
  useEffect(() => {
    if (!isOpen) {
      setTaskDescription('')
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskDescription.trim()) {
      onSubmit({
        description: taskDescription.trim(),
      })
      setTaskDescription('')
      onClose()
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
            className="description-field"
            value={taskDescription}  // ← ДОБАВИТЬ: value
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Название и описание задачи..."
            rows={3}
            autoFocus
          />
          <div className="one-button-container">
            <button className="button-human" disabled={!taskDescription.trim()}>
              Добавить Задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}