import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { InfoProject } from './InfoProject'

export const ProjectBox = ({ setMode, onSelectionsChange }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [projectSelections, setProjectSelections] = useState({})
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  useEffect(() => {
    if (onSelectionsChange) {
      onSelectionsChange(projectSelections)
    }
  }, [projectSelections, onSelectionsChange])
  
  const handleProjectUpdate = async (projectId, selectedTaskId) => {
    if (projectId && selectedTaskId !== undefined) {
      setProjectSelections(prev => ({
        ...prev,
        [projectId]: selectedTaskId
      }))
    }
    await loadProjects()
  }
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await api.getAllProjects()
      if (data.length === 0) {
        console.log('Нет проектов, возвращаемся в Inbox');
        setMode('inbox');
        await api.setState('inbox');
      }else{
        setProjects(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleProjectClick = (project) => {
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
            <p style={{ color: 'var(--color-purple)'}}>{project.name || 'Без названия'}</p>
            <p style={{ color: 'var(--color-purple)' }}>{project.description || 'Без описания'}</p>
          </div>
        ))}
      </section>
      
      <InfoProject
        isOpen={isInfoModalOpen}
        project={selectedProject}
        onClose={() => setIsInfoModalOpen(false)}
        onProjectUpdate={handleProjectUpdate}
        initialSelectedTaskId={projectSelections[selectedProject?.id]} 
      />
    </div>
  )
}