'use client'

import { Recipe } from '@prisma/client'
import Link from 'next/link'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { GiHotMeal } from 'react-icons/gi'
import { deleteRecipe } from '@/lib/client'
import { Button } from '../ui'

export default function RecipeListItem({ recipe }: { recipe: Recipe }) {
  const onDelete = async () => {
    await deleteRecipe(recipe)
  }
  return (
    <div key={recipe.id} className="flex flex-grow flex-row items-center justify-between space-x-2">
      <div className="mr-2">{recipe.name}</div>
      <div className="flex justify-end space-x-2">
        <Link href={`/recipe/${recipe.id}`}>
          <Button title="Cook">
            <GiHotMeal />
          </Button>
        </Link>
        <Link href={`/recipe/${recipe.id}`}>
          <Button title="Edit">
            <FaEdit />
          </Button>
        </Link>
        <Button title="Delete" onClick={onDelete}>
          <FaTrashAlt />
        </Button>
      </div>
    </div>
  )
}
