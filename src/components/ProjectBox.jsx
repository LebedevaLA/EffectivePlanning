import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { InfoProject } from './InfoProject'

export const ProjectBox = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  
  useEffect(() => {
    loadProjects()
  }, [])
  const handleProjectUpdate = async () => {
    await loadProjects()
  }
  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await api.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleProjectClick = (project) => {
    console.log('Проект который открываем:', project)  // ← ДОБАВЬ ЭТО
    setSelectedProject(project)
    setIsInfoModalOpen(true)
  }
  
  if (loading) return <div>Загрузка проектов...</div>
  
  return (
    <div className="project_container">
      <section className='project_area'>
        <h2>Проекты</h2>
        {projects.length === 0 && <h2>Нет проектов</h2>}
        {projects.map(project => (
          <div 
            key={project.id}
            className="project-item"
            onClick={() => handleProjectClick(project)}
          >
            <p style={{ color: 'var(--color-purple)' }}>{project.name || 'Без названия'}</p>
          </div>
        ))}
      </section>
      <InfoProject
        isOpen={isInfoModalOpen}
        project={selectedProject}
        onClose={() => setIsInfoModalOpen(false)}
        onProjectUpdate={handleProjectUpdate}  // ← ПЕРЕДАЕМ ФУНКЦИЮ
      />
    </div>
    
  )
}