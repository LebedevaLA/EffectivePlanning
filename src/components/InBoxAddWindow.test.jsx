import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './InBoxAddWindow'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()  
  const mockOnAdd = jest.fn()   
  beforeEach(() => {
    jest.clearAllMocks()
  })


  it('не должен рендериться, когда isOpen = false', () => {
    // Передаём isOpen={false} - окно должно быть скрыто
    render(
      <Modal isOpen={false} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    
    // Заголовка модального окна нет на странице
    expect(screen.queryByText('Добавить новое дело')).not.toBeInTheDocument()
  })

  it('должен рендериться, когда isOpen = true', () => {
    // Передаём isOpen={true} - окно должно показаться
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    
    // Все элементы модального окна присутствуют
    expect(screen.getByText('Добавить новое дело')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Опишите дело...')).toBeInTheDocument()
    expect(screen.getByText('Добавить')).toBeInTheDocument()
  })

  it('должен очищать текст при закрытии модального окна', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    
    // Вводим текст в текстовое поле
    const textarea = screen.getByPlaceholderText('Опишите дело...')
    fireEvent.change(textarea, { target: { value: 'Some task' } })
    
    // Текст введён
    expect(textarea.value).toBe('Some task')
    
    // Закрываем окно (меняем проп isOpen)
    rerender(<Modal isOpen={false} onClose={mockOnClose} onAdd={mockOnAdd} />)
    
    // Открываем снова
    rerender(<Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />)
    
    // Проверяем, что текстовое поле очистилось
    const newTextarea = screen.getByPlaceholderText('Опишите дело...')
    expect(newTextarea.value).toBe('')
  })

  it('должен вызывать onAdd с текстом задачи при отправке формы', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    const textarea = screen.getByPlaceholderText('Опишите дело...')
    const submitButton = screen.getByText('Добавить')
    
    // Вводим текст
    fireEvent.change(textarea, { target: { value: 'New important task' } })
    
    // Отправляем форму
    fireEvent.click(submitButton)
    
    // Проверяем: onAdd вызван с правильным текстом
    expect(mockOnAdd).toHaveBeenCalledWith('New important task')
    
    // Проверяем: окно закрылось
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('не должен вызывать onAdd при пустом тексте', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    
    // Кнопка "Добавить" должна быть disabled (неактивна)
    const submitButton = screen.getByText('Добавить')
    expect(submitButton).toBeDisabled()
    
    // Пытаемся нажать 
    fireEvent.click(submitButton)
    expect(mockOnAdd).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('должен закрываться при клике на оверлей', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    const overlay = document.querySelector('.modal-overlay')
    fireEvent.click(overlay)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('не должен закрываться при клике на контент модального окна', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )
    const modalContent = document.querySelector('.modal-content')
    fireEvent.click(modalContent)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('кнопка "Добавить" должна быть disabled при пустом тексте', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    )

    const submitButton = screen.getByText('Добавить')
    expect(submitButton).toBeDisabled()
    const textarea = screen.getByPlaceholderText('Опишите дело...')
    fireEvent.change(textarea, { target: { value: 'Task' } })
    expect(submitButton).not.toBeDisabled()
  })
})