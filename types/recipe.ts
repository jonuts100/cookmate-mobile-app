export interface Recipe {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  cookTime: number
  calories: number
  rating: number
  ingredients: string[]
  instructions: string[]
}
