import { render } from '@testing-library/react'
import Home from './page'
import { describe, expect, test } from 'vitest'

describe('HomeComponent', () => {
  test('Should render correctly', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/recipe book/i)).toBeDefined()
  })
})
