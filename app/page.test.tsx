import { render } from '@testing-library/react'
import Home from './page'

jest.mock('@/components/recipe/RecipeGallery')

xdescribe('HomeComponent', () => {
  it('Should render correctly', () => {
    const { getByText } = render(<Home />)
    expect(getByText(/create new recipe/i)).toBeInTheDocument()
  })
})
