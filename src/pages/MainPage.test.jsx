import React from 'react'
import { describe, test, expect, jest, beforeEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MainPage } from './MainPage'
import { api } from '../services/api'

jest.mock('../services/api', () => ({
  api: {
    getState: jest.fn(),
    setState: jest.fn(),
    getAllTasks: jest.fn(),
    getAllProjects: jest.fn(),
    getAllProblems: jest.fn(),
    getAllFromCurrentWave: jest.fn(),
    addTask: jest.fn(),
  },
}))

describe('MainPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    api.getState.mockResolvedValue({ mode: 'inbox' })
    api.setState.mockResolvedValue({ mode: 'inbox' })
    api.getAllTasks.mockResolvedValue([])
    api.getAllProjects.mockResolvedValue([])
    api.getAllProblems.mockResolvedValue([])
    api.getAllFromCurrentWave.mockResolvedValue([])
    api.addTask.mockResolvedValue({
      id: 1,
      text: 'Новое дело',
      status: 'inbox',
    })
  })

  test('отображает главную страницу', () => {
    render(<MainPage />)

    expect(
      screen.getByRole('heading', { name: /effective planning/i })
    ).toBeInTheDocument()
  })

  test('отображает кнопку добавления дела в Inbox', () => {
    render(<MainPage />)

    expect(
      screen.getByRole('button', { name: /добавить дело в inbox/i })
    ).toBeInTheDocument()
  })

  test('открывает модальное окно добавления дела', async () => {
    const user = userEvent.setup()

    render(<MainPage />)

    await user.click(
      screen.getByRole('button', { name: /добавить дело в inbox/i })
    )

    expect(screen.getByText(/добавить новое дело/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/опишите дело/i)).toBeInTheDocument()
  })
})