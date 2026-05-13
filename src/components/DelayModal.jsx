import { useState } from 'react'

export const DelayModal = ({ isOpen, taskText, onClose, onSubmit }) => {
  const [description, setDescription] = useState('')  // ← ДОБАВЬ ЭТО!
  const [delayOption, setDelayOption] = useState('')
  const [customDate, setCustomDate] = useState('')
  
  const delayOptions = [
    { label: 'Через 1 час', value: '1hour' },
    { label: 'Сегодня вечером (19:00)', value: 'today_evening' },
    { label: 'Завтра утром (09:00)', value: 'tomorrow_morning' },
    { label: 'Завтра вечером (19:00)', value: 'tomorrow_evening' },
    { label: 'Через неделю', value: 'week' },
    { label: 'Выбрать дату...', value: 'custom' }
  ]
  
  if (!isOpen) return null
  
  const getDelayDate = () => {
    const now = new Date()
    
    switch(delayOption) {
      case '1hour':
        return new Date(now.getTime() + 60 * 60 * 1000)
      case 'today_evening':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0)
      case 'tomorrow_morning':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0)
      case 'tomorrow_evening':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0)
      case 'week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case 'custom':
        return new Date(customDate)
      default:
        return null
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const delayDate = getDelayDate()
    if (delayDate && description.trim()) {  // ← проверяем что описание не пустое
      onSubmit({
        description: description.trim(),  // ← отправляем описание
        delayUntil: delayDate.toISOString()  // ← и дату
      })
      onClose()
    }
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>✕</button>
       
        <h2 className="modal-title">Отложить задачу</h2>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="name-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Описание задачи..."
            rows={3}
            autoFocus
          />
          
          <div className="delay-options-container">
            {delayOptions.map(option => (
              <label key={option.value} className="delay-option">
                <input
                  type="radio"
                  name="delay"
                  value={option.value}
                  checked={delayOption === option.value}
                  onChange={(e) => setDelayOption(e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          
          {delayOption === 'custom' && (
            <input
              type="datetime-local"
              className="delay-input"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              required
            />
          )}
          
          <div className="one-button-container">
            <button type="submit" className="button-human" disabled={!delayOption || !description.trim()}>
              Отложить Задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}