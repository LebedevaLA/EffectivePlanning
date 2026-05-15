import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { api } from './api'

globalThis.fetch = jest.fn()

const API_URL = 'http://localhost:3000/api'

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockSuccess = (data = { success: true }) => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    })
  }

  const mockFail = (status = 500) => {
    fetch.mockResolvedValue({
      ok: false,
      status,
    })
  }

  test('addTask отправляет POST запрос с текстом дела', async () => {
    const taskText = 'Test task'
    const mockResponse = { id: 1, text: taskText }

    mockSuccess(mockResponse)

    const result = await api.addTask(taskText)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: taskText }),
    })

    expect(result).toEqual(mockResponse)
  })

  test('addTask выбрасывает ошибку при неудачном запросе', async () => {
    mockFail()

    await expect(api.addTask('Test task')).rejects.toThrow(
      'Ошибка при добавлении дела'
    )
  })

  test('addProblem отправляет задачу в problems', async () => {
    const problem = {
      description: 'Проблема',
      projectId: 1,
    }

    mockSuccess({ id: 1, ...problem })

    const result = await api.addProblem(problem)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    })

    expect(result).toEqual({ id: 1, ...problem })
  })

  test('addProblem выбрасывает ошибку', async () => {
    mockFail()

    await expect(api.addProblem({ description: 'Ошибка' })).rejects.toThrow(
      'Ошибка при добавлении задачи'
    )
  })

  test('addProject отправляет проект', async () => {
    const project = {
      name: 'Проект',
      description: 'Описание',
      sourceText: 'Исходный текст',
    }

    mockSuccess({ id: 1, ...project })

    const result = await api.addProject(project)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })

    expect(result).toEqual({ id: 1, ...project })
  })

  test('addProject выбрасывает ошибку', async () => {
    mockFail()

    await expect(api.addProject({ name: 'Проект' })).rejects.toThrow(
      'Ошибка при добавлении проека'
    )
  })

  test('getAllTasks получает inbox-задачи', async () => {
    const mockTasks = [
      { id: 1, text: 'Task 1', status: 'inbox' },
      { id: 2, text: 'Task 2', status: 'inbox' },
    ]

    mockSuccess({ taskObjects: mockTasks })

    const result = await api.getAllTasks()

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/tasks?status=inbox`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual(mockTasks)
  })

  test('getAllTasks выбрасывает ошибку', async () => {
    mockFail(404)

    await expect(api.getAllTasks()).rejects.toThrow(
      'Ошибка при получении дел'
    )
  })

  test('deleteTask удаляет дело по id', async () => {
    mockSuccess({ success: true })

    const result = await api.deleteTask(5)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/tasks/5`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })

  test('deleteTask выбрасывает ошибку', async () => {
    mockFail()

    await expect(api.deleteTask(5)).rejects.toThrow(
      'Ошибка при удалении дела'
    )
  })

  test('addDelayedTask отправляет отложенную задачу', async () => {
    const delayedData = {
      description: 'Отложить',
      delayUntil: '2026-05-20T10:00:00Z',
      sourceTaskId: 1,
    }

    mockSuccess({ id: 10, ...delayedData })

    const result = await api.addDelayedTask(delayedData)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/delayed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(delayedData),
    })

    expect(result).toEqual({ id: 10, ...delayedData })
  })

  test('addDelayedTask выбрасывает ошибку', async () => {
    mockFail()

    await expect(api.addDelayedTask({})).rejects.toThrow(
      'Ошибка при сохранении отложенной задачи'
    )
  })

  test('getAllProjects получает проекты', async () => {
    const projects = [
      { id: 1, name: 'Проект 1' },
      { id: 2, name: 'Проект 2' },
    ]

    mockSuccess({ projects })

    const result = await api.getAllProjects()

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual(projects)
  })

  test('getAllProjects возвращает пустой массив, если projects нет', async () => {
    mockSuccess({})

    const result = await api.getAllProjects()

    expect(result).toEqual([])
  })

  test('deleteProject удаляет проект', async () => {
    mockSuccess({ success: true })

    const result = await api.deleteProject(2)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects/2`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })

  test('updateProject обновляет проект', async () => {
    const projectData = {
      name: 'Новое имя',
      description: 'Новое описание',
    }

    mockSuccess({ id: 3, ...projectData })

    const result = await api.updateProject(3, projectData)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects/3`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })

    expect(result).toEqual({ id: 3, ...projectData })
  })

  test('getAllProblems получает задачи/problems', async () => {
    const problems = [
      { id: 1, description: 'Задача 1' },
      { id: 2, description: 'Задача 2' },
    ]

    mockSuccess({ problems })

    const result = await api.getAllProblems()

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/problems`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual(problems)
  })

  test('deleteProblem удаляет задачу/problem', async () => {
    mockSuccess({ success: true })

    const result = await api.deleteProblem(7)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/problems/7`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })

  test('addToCurrentWave отправляет полный объект задачи в текущую волну', async () => {
    const task = {
      id: 1778849161850,
      text: 'Какая-то задача 1',
      description: 'Какая-то задача 1',
      problemId: 1778849161850,
      problemDescription: 'Какая-то задача 1',
      projectId: 3,
      projectName: '443',
      status: 'active',
      selectedAt: '2026-05-15T12:50:27.537Z',
    }

    mockSuccess({ success: true, task })

    const result = await api.addToCurrentWave(task)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/current-wave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    expect(result).toEqual({ success: true, task })
  })

  test('addToCurrentWave выбрасывает ошибку при неправильной отправке', async () => {
    mockFail(400)

    await expect(
      api.addToCurrentWave({
        problemId: 1,
        selectedAt: '2026-05-15T12:50:27.544Z',
      })
    ).rejects.toThrow('Ошибка при добавлении в волну')
  })

  test('getAllFromCurrentWave получает текущую волну', async () => {
    const wave = [
      {
        id: 1,
        description: 'Задача из волны',
        status: 'active',
      },
    ]

    mockSuccess(wave)

    const result = await api.getAllFromCurrentWave()

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/current-wave`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual(wave)
  })

  test('removeTaskFromProject удаляет задачу из проекта', async () => {
    mockSuccess({ success: true })

    const result = await api.removeTaskFromProject(1, 9)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects/1/tasks/9`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })

  test('getState получает режим приложения', async () => {
    mockSuccess({ mode: 'inbox' })

    const result = await api.getState()

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/mode`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ mode: 'inbox' })
  })

  test('setState обновляет режим приложения', async () => {
    const mode = { mode: 'focus' }

    mockSuccess(mode)

    const result = await api.setState(mode)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/mode`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mode),
    })

    expect(result).toEqual(mode)
  })

  test('doneProblemfromProject отмечает задачу проекта выполненной', async () => {
    mockSuccess({ success: true })

    const result = await api.doneProblemfromProject(4, 15)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/projects/4/tasks/15/done`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })

  test('deleteProblemfromCurrentWave удаляет задачу из текущей волны', async () => {
    mockSuccess({ success: true })

    const result = await api.deleteProblemfromCurrentWave(12)

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/current-wave/12`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    expect(result).toEqual({ success: true })
  })
})