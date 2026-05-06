import { render, screen, fireEvent } from '@testing-library/react'
import { ModeToggle } from './ModeToggle'

describe('ModeToggle Component', () => {
  const mockOnToggle = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('должен отображать режим monkey', () => {
    render(<ModeToggle mode="monkey" onToggle={mockOnToggle} />)
    
    // Проверяем наличие обоих эмодзи
    expect(screen.getByText('🐒')).toBeInTheDocument()
    expect(screen.getByText('🧑')).toBeInTheDocument()
    
    // Обезьяна должна быть активной (подсвечена)
    expect(screen.getByText('🐒')).toHaveClass('active')
  })

  it('должен отображать режим human', () => {
    render(<ModeToggle mode="human" onToggle={mockOnToggle} />)
    
    // Человек должен быть активным
    expect(screen.getByText('🧑')).toHaveClass('active')
    
    // Обезьяна не активна
    expect(screen.getByText('🐒')).not.toHaveClass('active')
  })

  it('должен вызывать onToggle с "human" при клике в режиме monkey', () => {
    render(<ModeToggle mode="monkey" onToggle={mockOnToggle} />)  
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Проверяем: onToggle вызван с параметром 'human'
    expect(mockOnToggle).toHaveBeenCalledWith('human')
  })

  it('должен вызывать onToggle с "monkey" при клике в режиме human', () => {
    render(<ModeToggle mode="human" onToggle={mockOnToggle} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // При клике в режиме human должен переключиться на monkey
    expect(mockOnToggle).toHaveBeenCalledWith('monkey')
  })
})