import '../styles/modal.css'
import { useState, useEffect } from 'react'

export const Modal = ({ isOpen, onClose, onAdd }) => {
  const [taskText, setTaskText] = useState('')
  
  useEffect(() => {
    if (!isOpen) {
      setTaskText('')
    }
  }, [isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAdd(taskText.trim())
      setTaskText('')
      onClose()
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Добавить новое дело</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="description-field"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Опишите дело..."
            rows={4}
            autoFocus
          />
          <div className="one-button-container">
            <button className = "button-monkey" disabled={!taskText.trim()}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}