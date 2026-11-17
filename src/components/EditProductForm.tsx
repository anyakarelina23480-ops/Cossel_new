import { useState } from 'react'
import type { Product } from '../data/products'
import { API_URL } from '../data/config'
import { productGroups, groupLabels, type ProductGroup } from '../data/categories'

interface EditProductFormProps {
  product: Product
  onProductUpdated: (product: Product) => void
  onCancel: () => void
}

function EditProductForm({
  product,
  onProductUpdated,
  onCancel,
}: EditProductFormProps) {
  const [name, setName] = useState(product.name)
  const [brand, setBrand] = useState(product.brand)
  const [category, setCategory] = useState(product.category)
  const [description, setDescription] = useState(product.description)
  const [ingredients, setIngredients] = useState(product.ingredients)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (
      !name.trim() ||
      !brand.trim() ||
      !category.trim() ||
      !description.trim() ||
      !ingredients.trim()
    ) {
      setError('Заполните все обязательные поля')
      return
    }

  try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...product,
            name: name.trim(),
            brand: brand.trim(),
            category,
            description: description.trim(),
            ingredients: ingredients.trim(),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Не удалось изменить товар')
      }

      const updatedProduct: Product = await response.json()
      onProductUpdated(updatedProduct)
    } catch {
      setError('Ошибка изменения товара')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Редактирование товара</h2>

      <label>Название:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Бренд:</label>
      <input value={brand} onChange={(e) => setBrand(e.target.value)} required />

      <label>Категория:</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
     >
        {(Object.keys(productGroups) as ProductGroup[]).map((group) => (
          <optgroup key={group} label={groupLabels[group]}>
            {productGroups[group].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <label>Описание:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <label>Состав:</label>
      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : 'Сохранить изменения'}
      </button>

      <button type="button" onClick={onCancel}>
        Отмена
      </button>
    </form>
  )
}

export default EditProductForm