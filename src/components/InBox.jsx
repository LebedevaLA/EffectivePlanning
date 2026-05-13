import { useState } from 'react'
import { TaskModal } from "./InBoxAddWindow";
import { UnloadModal } from "./UnloadModal";
import { api } from "../services/api"

export const InBox = ({ addTaskModule, onCloseAddTask, onAddTask, setMode }) => {
  const [isUnloadModalOpen, setIsUnloadModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [allTasks, setAllTasks] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(null)

  const handleOpenUnloadModal = () => {
    if (allTasks == null) {
      loadTasks();
    } else {
      setIsUnloadModalOpen(true);
    }
  }

  const handleCloseUnloadModal = () => {
    const nextIndex = currentIndex + 1;
    handleDeleteCurrentTask()
    if (nextIndex < allTasks.length) {
      setCurrentTask(allTasks[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      console.log('Все дела распределены')
      handleUpdateState()
      setCurrentTask(null);
      setCurrentIndex(null);
      setAllTasks(null);
      setIsUnloadModalOpen(false);
    }
  }
  const handleUpdateState = async () => {
    try{
      setMode('projects')
      await api.setState('projects');
    }
    catch{
      console.log('Ошибка обновления состояния')
    }
  }

  const loadTasks = async () => {
    try {
      const tasks = await api.getAllTasks()
      setAllTasks(tasks)
      setCurrentIndex(0)
      if (tasks.length > 0) {
        setCurrentTask(tasks[0])
        setIsUnloadModalOpen(true)
      } else {
        console.log('Нет дел для разгрузки');
        setIsUnloadModalOpen(false);
      }
    } catch (error) {
      setIsUnloadModalOpen(false);
      console.error('Ошибка при получении дел:', error);
    }
  }
  
  const handleDeleteCurrentTask = async () => {
    if (currentTask) {
      try {
        await api.deleteTask(currentTask.id)
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
  
  const handleDelayTask = async (delayData) => { 
    if (currentTask) {
      try {
        await api.addDelayedTask({
          description: delayData.description,
          delayUntil: delayData.delayUntil,
        })
      } catch (error) {
        console.error('Ошибка при откладывании:', error)
      }
    }
  }

  return (
    <div className="inbox_container">
      <section className="inbox">
        <h2>InBox</h2>
        <button className="human_button_inbox" onClick={handleOpenUnloadModal}>
          Разгрузить
        </button>
      </section>
      
      <UnloadModal
        isOpen={isUnloadModalOpen}
        task={currentTask}
        onClose={handleCloseUnloadModal}
        onCreateProject={handleCreateProject}
        onCreateProblem={handleCreateProblem}
        onDelay={handleDelayTask}
        addTaskModule={addTaskModule}
        onCloseAddTask={onCloseAddTask}
        onAddTask={onAddTask}
      />
    </div>
  )
}