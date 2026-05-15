import { useState, useEffect } from 'react'
import { InBox } from '../components/InBox'
import { TaskModal } from '../components/InBoxAddWindow'
import { api } from '../services/api'
import { ProjectBox } from '../components/ProjectBox'
import { WaveSelectionModal } from '../components/WaveSelectionModal'
import { GiveProblem } from '../components/GiveProblem'

export const MainPage = () => {
  const [mode, setMode] = useState('')
  const [addTaskModule, setAddTaskModule] = useState(false)
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false)
  const [savedSelections, setSavedSelections] = useState({})

  const handleState = async () => {
    try {
      let res = await api.getState()
      setMode(res.mode)
    } catch {
      console.log('Ошибка получения состояния')
    }
  }

  useEffect(() => {
    handleState()
  }, [])

  const handleAddTask = async (taskText) => {
    try {
      let res = await api.addTask(taskText)
      setAddTaskModule(false)
    } catch {
      console.log('Ошибка передачи дела')
    }
  }

  const handleAddTaskModule = () => {
    setAddTaskModule(!addTaskModule)
  }

  return (
    <div className="page-wrapper">
      <h1>Effective Planning</h1>
      <button className="add-task-button" onClick={handleAddTaskModule}>
        Добавить дело в Inbox
      </button>

      {mode === 'inbox' && (
        <InBox
          addTaskModule={addTaskModule}
          onCloseAddTask={handleAddTaskModule}
          onAddTask={handleAddTask}
          setMode={setMode}
        />
      )}

      {mode === 'projects' && (
        <>
          <ProjectBox 
            setMode={setMode} 
            onSelectionsChange={setSavedSelections}
          />
          <button
            className="button-select"
            onClick={() => setIsWaveModalOpen(true)}
          >
            Выбрать задачи на текущую волну
          </button>
        </>
      )}
      {mode === 'do' && (
        <GiveProblem
          setMode={setMode}
          addTaskModule={addTaskModule}
          onCloseAddTask={handleAddTaskModule}
          onAddTask={handleAddTask}
        />
      )}
      <TaskModal
        isOpen={addTaskModule}
        onClose={handleAddTaskModule}
        onAdd={handleAddTask}
      />

      <WaveSelectionModal
        isOpen={isWaveModalOpen}
        onClose={() => setIsWaveModalOpen(false)}
        initialSelections={savedSelections}
        setMode = {setMode}
      />
    </div>
  )
}