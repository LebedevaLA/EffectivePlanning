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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Добавить новое дело</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="modal-textarea"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Опишите дело..."
            rows={4}
            autoFocus
          />
          <div className="modal-buttons">
            <button type="submit" className="modal-submit" disabled={!taskText.trim()}>
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}