import { useState, useEffect } from 'react'
import { InBox } from '../components/InBox'
import { TaskModal } from '../components/InBoxAddWindow'
import { api } from '../services/api'

export const MainPage = () => {
  const [mode, setMode] = useState('')
  const [addTaskModule, setAddTaskModule] = useState(false);
  const handleState = async  () => {
    try{
      let res = await api.getState();
      setMode(res.mode);
    }catch{
      console.log('Ошибка получения состояния');
    }
  }

  useEffect(()=>{
    handleState();
  },[])
   
  const handleAddTask = async (taskText) =>{
    try{
      let res = await api.addTask(taskText);
      setAddTaskModule(false);
    }catch{
      console.log("Ошибка передачи дела")
    }
  }

  const handleAddTaskModule = () =>{
    if (addTaskModule == false) setAddTaskModule(true);
    else setAddTaskModule(false);
  }
  return (
    <div className="page-wrapper">
      <h1>Effective Planning</h1>
      <button className = 'add-task-button' onClick={handleAddTaskModule}>Добавить дело в Inbox</button>
      {mode === 'inbox' && <InBox 
          addTaskModule={addTaskModule}
          onCloseAddTask={handleAddTaskModule}
          onAddTask={handleAddTask}
          setMode = {setMode}
        />
      }
      {mode === 'projects' && <ProjectBox
          setMode = {setMode}
        />
      }
      <TaskModal 
        isOpen={addTaskModule}
        onClose={handleAddTaskModule}
        onAdd={handleAddTask}
      />
    </div>
  )
}