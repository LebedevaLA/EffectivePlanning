import { useState, useEffect } from 'react'
import { api } from '../services/api'

export const ProjectBox = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await api.getAllProjects()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <div>Загрузка проектов...</div>
  
  return (
    <div className="projects-section">
      <h2>Проекты</h2>
      {projects.length === 0 ? (
        <p>Нет проектов. Создайте первый через разгрузку InBox!</p>
      ) : (
        <div className="projects-list">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <small>Создан из: {project.sourceText}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}