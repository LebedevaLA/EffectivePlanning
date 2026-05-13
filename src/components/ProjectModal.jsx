// ProjectModal.jsx
import { useState, useEffect } from 'react'

export const ProjectModal = ({ isOpen, taskText, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  
  useEffect(() => {
    if (!isOpen) {
      setProjectName('')
      setProjectDescription('')
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("🔴 ProjectModal отправляет:", {name: projectName.trim(), description: projectDescription.trim()})
    if (projectName.trim()) {
      onSubmit({
        name: projectName.trim(),
        description: projectDescription.trim(),
      })
    }
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>
        <h2 className="modal-title">{taskText}</h2>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="name-field"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Название проекта..."
            rows={2}
            autoFocus
          />
          <textarea
            className="description-field"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Описание проекта..."
            rows={4}
          />
          <div className="one-button-container">
            <button type="submit" className="button-human" disabled={!projectName.trim()}>
              Добавить Проект
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}