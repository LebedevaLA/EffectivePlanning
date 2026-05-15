import React from 'react'
import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { InBox } from './InBox'

describe('InBox', () => {
  test('отображает заголовок InBox', () => {
    render(<InBox />)

    expect(
      screen.getByRole('heading', { name: /inbox/i })
    ).toBeInTheDocument()
  })

  test('отображает кнопку Разгрузить', () => {
    render(<InBox />)

    expect(
      screen.getByRole('button', { name: /разгрузить/i })
    ).toBeInTheDocument()
  })
})