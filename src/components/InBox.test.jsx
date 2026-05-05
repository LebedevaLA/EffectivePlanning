import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InBox } from './InBox'
import { api } from '../services/api'

jest.mock('../services/api')

jest.mock('./InBoxAddWindow', () => ({
  Modal: ({ isOpen, onClose, onAdd }) => (
    isOpen ? (
      <div data-testid="modal">
        <button onClick={() => onAdd('Test task')}>Add</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  )
}))

describe('InBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Режим monkey', () => {
    it('должен отображать кнопку "Добавить" в режиме monkey', () => {
      render(<InBox mode="monkey" />)
      
      expect(screen.getByText('Добавить')).toBeInTheDocument()
      expect(screen.queryByText('Разгрузить')).not.toBeInTheDocument()
    })

    it('должен открывать модальное окно при клике на "Добавить"', () => {
      render(<InBox mode="monkey" />)
      
      const addButton = screen.getByText('Добавить')
      fireEvent.click(addButton)
      
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })

  describe('Режим human', () => {
    it('должен отображать кнопку "Разгрузить" в режиме human', () => {
      render(<InBox mode="human" />)
      
      expect(screen.getByText('Разгрузить')).toBeInTheDocument()
      expect(screen.queryByText('Добавить')).not.toBeInTheDocument()
    })

    it('должен загружать задачи при клике на "Разгрузить"', async () => {
      const mockTasks = [
        { id: 1, text: 'Task 1', status: 'inbox' },
        { id: 2, text: 'Task 2', status: 'inbox' }
      ]
      api.getAllTasks.mockResolvedValue(mockTasks)

      render(<InBox mode="human" />)
      
      const unloadButton = screen.getByText('Разгрузить')
      fireEvent.click(unloadButton)
      
      await waitFor(() => {
        expect(api.getAllTasks).toHaveBeenCalledTimes(1)
        expect(localStorage.setItem).toHaveBeenCalledWith('inbox_tasks', JSON.stringify(mockTasks))
      })
    })

    it('должен обрабатывать ошибку при загрузке задач', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      api.getAllTasks.mockRejectedValue(new Error('Network error'))

      render(<InBox mode="human" />)
      
      const unloadButton = screen.getByText('Разгрузить')
      fireEvent.click(unloadButton)
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled()
      })
      
      consoleError.mockRestore()
    })
  })

  describe('Общая функциональность', () => {
    it('должен отображать заголовок InBox', () => {
      render(<InBox mode="monkey" />)
      
      expect(screen.getByText('InBox')).toBeInTheDocument()
    })
  })
})