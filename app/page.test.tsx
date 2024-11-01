import { render } from '@testing-library/react'
import Home from './page'

vi.mock('next/image')

describe('HomeComponent', () => {
  test('Should render correctly', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/recipe book/i)).toBeDefined()
  })
})
