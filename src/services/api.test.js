import { api } from './api' 
global.fetch = jest.fn()

describe('API Service', () => {
  // Сбрасываем мок fetch перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('addTask', () => {
    const mockTaskText = 'Test task'
    
    it('должен отправлять POST запрос с правильными данными', async () => {
      const mockResponse = { id: 1, text: mockTaskText, status: 'inbox' }
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await api.addTask(mockTaskText)

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/tasks',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: mockTaskText, 
            status: 'inbox' 
          })
        }
      )
      
      expect(result).toEqual(mockResponse)
    })

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500
      })
      await expect(api.addTask(mockTaskText)).rejects.toThrow(
        'Ошибка при добавлении дела'
      )
    })
  })
  
  describe('getAllTasks', () => {
    it('должен отправлять GET запрос для получения задач со статусом inbox', async () => {
      const mockTasks = {
        taskObjects: [
          { id: 1, text: 'Task 1', status: 'inbox' },
          { id: 2, text: 'Task 2', status: 'inbox' }
        ]
      }
      
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      })
      const result = await api.getAllTasks()

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/tasks?status=inbox',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      expect(result).toEqual(mockTasks.taskObjects)
    })

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404
      })

      // Ожидаем ошибку
      await expect(api.getAllTasks()).rejects.toThrow(
        'Ошибка при получении дел'
      )
    })
  })
})