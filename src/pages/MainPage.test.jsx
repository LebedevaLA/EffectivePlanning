import { render, screen, fireEvent } from '@testing-library/react'
import { MainPage } from './MainPage'

// Мокаем дочерние компоненты
jest.mock('../components/InBox', () => ({
  InBox: ({ mode }) => <div data-testid="inbox">Mode: {mode}</div>
}))

jest.mock('../components/ModeToggle', () => ({
  ModeToggle: ({ mode, onToggle }) => (
    <button onClick={() => onToggle(mode === 'monkey' ? 'human' : 'monkey')}>
      Toggle Mode (current: {mode})
    </button>
  )
}))

describe('MainPage Component', () => {
  it('должен отображать заголовок', () => {
    render(<MainPage />)
    expect(screen.getByText('Effective Planning')).toBeInTheDocument()
  })

  it('должен начальный режим monkey', () => {
    render(<MainPage />)
    expect(screen.getByTestId('inbox')).toHaveTextContent('Mode: monkey')
  })

  it('должен переключать режим при клике на тумблер', () => {
    render(<MainPage />)
    
    const toggleButton = screen.getByText(/Toggle Mode/)
    
    // Начальный режим
    expect(screen.getByTestId('inbox')).toHaveTextContent('Mode: monkey')
    
    // Переключение на human
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('inbox')).toHaveTextContent('Mode: human')
    
    // Переключение обратно на monkey
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('inbox')).toHaveTextContent('Mode: monkey')
  })
})