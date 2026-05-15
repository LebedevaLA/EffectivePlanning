import React from 'react'
import { describe, test, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskModal } from './InBoxAddWindow'

describe('TaskModal', () => {
  test('не отображает окно, если isOpen=false', () => {
    render(
      <TaskModal
        isOpen={false}
        onClose={jest.fn()}
        onAdd={jest.fn()}
      />
    )

    expect(screen.queryByText(/добавить новое дело/i)).not.toBeInTheDocument()
  })

  test('отображает окно добавления дела, если isOpen=true', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={jest.fn()}
        onAdd={jest.fn()}
      />
    )

    expect(screen.getByText(/добавить новое дело/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/опишите дело/i)).toBeInTheDocument()
  })

  test('позволяет ввести текст задачи', async () => {
    const user = userEvent.setup()

    render(
      <TaskModal
        isOpen={true}
        onClose={jest.fn()}
        onAdd={jest.fn()}
      />
    )

    const input = screen.getByPlaceholderText(/опишите дело/i)

    await user.type(input, 'Новая задача')

    expect(input).toHaveValue('Новая задача')
  })

  test('кнопка добавления заблокирована при пустом поле', () => {
    render(
      <TaskModal
        isOpen={true}
        onClose={jest.fn()}
        onAdd={jest.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: /добавить/i })
    ).toBeDisabled()
  })

  test('вызывает onAdd при отправке формы', async () => {
    const user = userEvent.setup()
    const onAdd = jest.fn()

    render(
      <TaskModal
        isOpen={true}
        onClose={jest.fn()}
        onAdd={onAdd}
      />
    )

    await user.type(screen.getByPlaceholderText(/опишите дело/i), 'Новая задача')

    await user.click(screen.getByRole('button', { name: /добавить/i }))

    expect(onAdd).toHaveBeenCalledWith('Новая задача')
  })
})