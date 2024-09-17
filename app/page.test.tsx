import { render } from '@testing-library/react'
import Home from './page'

describe('HomeComponent', () => {
  it('Should render correctly', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/get started by editing/i)).toBeInTheDocument()
  })
})
