// InBox.jsx
import { useState } from 'react'
import { Modal } from "./InBoxAddWindow";
import { UnloadModal } from "./UnloadModal";
import { api } from "../services/api"

export const InBox = ({ mode }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUnloadModalOpen, setIsUnloadModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [allTasks, setAllTasks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }
  
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }
  
  const handleOpenUnloadModal = async () => {
    try {
      const tasks = await api.getAllTasks()
      setAllTasks(tasks)
      setCurrentIndex(0)
      if (tasks.length > 0) {
        setCurrentTask(tasks[0])
        setIsUnloadModalOpen(true)
      } else {
        console.log('Нет дел для разгрузки')
      }
    } catch (error) {
      console.error('Ошибка при получении дел:', error)
    }
  }
  
  const handleCloseUnloadModal = () => {
    setIsUnloadModalOpen(false)
    setCurrentTask(null)
    setCurrentIndex(0)
    setAllTasks([])
  }
  
  const handleAddTask = async (taskText) => {
    try {
      await api.addTask(taskText)
      console.log('Дело добавлено')
    } catch (error) {
      console.error('Ошибка при добавлении:', error)
    }
    setIsAddModalOpen(false)
  }
  
  // Переход к следующему делу
  const loadNextTask = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < allTasks.length) {
      setCurrentIndex(nextIndex)
      setCurrentTask(allTasks[nextIndex])
    } else {
      setIsUnloadModalOpen(false)
      setCurrentTask(null)
      setCurrentIndex(0)
      setAllTasks([])
      console.log('Все дела обработаны!')
    }
  }
  
  const handleDeleteCurrentTask = async () => {
    if (currentTask) {
      try {
        await api.deleteTask(currentTask.id)
        await loadNextTask()
      } catch (error) {
        console.error('Ошибка при удалении:', error)
      }
    }

  }
  
  const handleCreateProject = async (projectData) => {
    if (currentTask) {
      try {
        await api.addProject(projectData)
      } catch (error) {
        console.error('Ошибка при создании проекта:', error)
      }
    }
  }
  
  const handleCreateProblem = async (problemData) => {
    if (currentTask) {
      try {
        await api.addProblem(problemData)
      } catch (error) {
        console.error('Ошибка при создании задачи:', error)
      }
    }
  }
  
  const handleDelayTask = async (delayUntil) => {
    if (currentTask) {
      try {
        await api.delayTask(currentTask.id, delayUntil)
      } catch (error) {
        console.error('Ошибка при откладывании:', error)
      }
    }
  }

  return (
    <div className="inbox_container">
      <section className="inbox">
        <h2>InBox</h2>
        {mode === 'monkey' && (
          <button className="monkey_buttonAdd" onClick={handleOpenAddModal}>
            Добавить
          </button>
        )}
        {mode === 'human' && (
          <button className="human_button_inbox" onClick={handleOpenUnloadModal}>
            Разгрузить
          </button>
        )}
      </section>
      
      <Modal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddTask}
      />
      
      <UnloadModal
        isOpen={isUnloadModalOpen}
        task={currentTask}
        onClose={handleCloseUnloadModal}
        onDelete={handleDeleteCurrentTask}
        onCreateProject={handleCreateProject}
        onCreateProblem={handleCreateProblem}
        onDelay={handleDelayTask}
      />
    </div>
  )
}