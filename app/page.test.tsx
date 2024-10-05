import { render } from '@testing-library/react'
import Home from './page animation'

jest.mock('@/components/recipe/RecipeList')

describe('HomeComponent', () => {
  it('Should render correctly', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/create new recipe/i)).toBeInTheDocument()
  })
})
