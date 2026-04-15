
import { useState } from 'react'
import { Modal } from "./InBoxAddWindow";
import { api } from "../services/api"

export const InBox = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  
  const handleAddTask = async (taskText) => {
    console.log('Новое дело:', taskText)
    if (mode === 'monkey') {
        try {
            await api.addTask(taskText);
            console.log('Дело отправлено на сервер');
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
        }
    } else {
        try {
            const tasks = await api.getAllTasks();
            console.log('Получены дела:', tasks);
            localStorage.setItem('inbox_tasks', JSON.stringify(tasks));
            console.log('Дела сохранены в localStorage');
        } catch (error) {
            console.error('Ошибка при получении дел:', error);
        }
    }
    setIsModalOpen(false)
  }
  
  return (
    <div className="inbox_container">
      <section className="inbox">
        <h2>InBox</h2>
        {mode === 'monkey' && (
          <button className="monkey_buttonAdd" onClick={handleOpenModal}>
            Добавить
          </button>
        )}
        {mode === 'human' && (
          <button className="human_button_inbox">
            Разгрузить
          </button>
        )}
      </section>
      
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddTask}
      />
    </div>
  )
}