import { useState, useEffect } from 'react'
import { api } from '../services/api'

export const SelectProblems = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([])
  const [allProblems, setAllProblems] = useState([])
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProblems, setShowProblems] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setLoading(true)
    try {
      const projectsData = await api.getAllProjects()
      setProjects(projectsData)
      
      const problemsData = await api.getAllProblems()
      setAllProblems(problemsData)
      
      setCurrentProjectIndex(0)
      setSelectedTask(null)
      setShowProblems(false)
    } catch (error) {
      console.error('Ошибка загрузки:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTask = (taskId) => {
    setSelectedTask(taskId)
  }

  const handleConfirmAndNext = async () => {
    if (selectedTask === null) return
    
    const currentProject = projects[currentProjectIndex]
    const selectedTaskData = currentProject.tasks.find(t => t.id === selectedTask)
    
    try {
      // ✅ ОТПРАВЛЯЕМ ТОЛЬКО НУЖНЫЕ ПОЛЯ
      await api.addToCurrentWave({
        description: selectedTaskData.description,
        source: 'project',
        projectId: currentProject.id,
        projectName: currentProject.name
      })
      
      await api.removeTaskFromProject(currentProject.id, selectedTask)
      
      if (currentProjectIndex + 1 < projects.length) {
        const newProjectsData = await api.getAllProjects()
        setProjects(newProjectsData)
        setCurrentProjectIndex(currentProjectIndex + 1)
        setSelectedTask(null)
      } else {
        const newProblemsData = await api.getAllProblems()
        setAllProblems(newProblemsData)
        setShowProblems(true)
      }
      
    } catch (error) {
      console.error('Ошибка при подтверждении:', error)
    }
  }

  const handleSkipProject = () => {
    if (currentProjectIndex + 1 < projects.length) {
      setCurrentProjectIndex(currentProjectIndex + 1)
      setSelectedTask(null)
    } else {
      setShowProblems(true)
    }
  }

  const handleSelectProblem = async (problemId) => {
    const selectedProblem = allProblems.find(p => p.id === problemId)
    
    try {
      // ✅ ОТПРАВЛЯЕМ ТОЛЬКО НУЖНЫЕ ПОЛЯ
      await api.addToCurrentWave({
        description: selectedProblem.description,
        source: 'problem'
      })
      
      await api.deleteProblem(problemId)
      
      const newProblemsData = await api.getAllProblems()
      setAllProblems(newProblemsData)
      
      if (newProblemsData.length === 0) {
        onClose()
      }
      
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  if (!isOpen) return null
  if (loading) return <div className="modal-overlay"><div className="modal-content">Загрузка...</div></div>

  // Отображение отдельных задач (после проектов)
  if (showProblems) {
    if (allProblems.length === 0) {
      onClose()
      return null
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content-container" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
          <button className="modal-close-button" onClick={onClose}>✕</button>
          
          <h2 className="modal-title">Отдельные задачи</h2>
          
          <div className="problems-list">
            {allProblems.map(problem => (
              <div key={problem.id} className="problem-select-item">
                <input
                  type="radio"
                  name="problem"
                  onChange={() => handleSelectProblem(problem.id)}
                />
                <p>{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Отображение проектов
  const currentProject = projects[currentProjectIndex]
  
  if (!currentProject || projects.length === 0) {
    setShowProblems(true)
    return null
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content-container" style={{ width: '500px' }}>
        <h2 className="modal-title">{currentProject.name || 'Без названия'}</h2>
        <p className="project-description">{currentProject.description || 'Нет описания'}</p>
        
        {currentProject.tasks && currentProject.tasks.length > 0 ? (
          <div className="tasks-select-list">
            {currentProject.tasks.map(task => (
              <div key={task.id} className="task-select-item">
                <input
                  type="radio"
                  name="task"
                  checked={selectedTask === task.id}
                  onChange={() => handleSelectTask(task.id)}
                />
                <label>{task.description}</label>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>В этом проекте нет задач</p>
        )}
        
        <div className="selection-buttons">
          {selectedTask !== null && (
            <button className="button-human" onClick={handleConfirmAndNext}>
              Выбрать и продолжить
            </button>
          )}
          <button className="button-human" onClick={handleSkipProject}>
            Пропустить этот проект
          </button>
        </div>
        
        <div className="progress">
          Проект {currentProjectIndex + 1} из {projects.length}
        </div>
      </div>
    </div>
  )
}