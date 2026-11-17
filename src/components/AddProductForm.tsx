import { useState } from 'react'
import type { Product } from '../data/products'
import { API_URL } from '../data/config'
import { productGroups, groupLabels, type ProductGroup } from '../data/categories'

interface AddProductFormProps {
  onProductAdded: (product: Product) => void
  onCancel: () => void
}

function AddProductForm({ onProductAdded, onCancel }: AddProductFormProps) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [type, setType] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const newProduct = {
      name: name.trim(),
      brand: brand.trim(),
      category,
      image: image.trim(),
      type: type.split(',').map(item => item.trim()).filter(Boolean),
      ingredients: ingredients.trim(),
      description: description.trim(),
    }

    if (
      !name.trim() ||
      !brand.trim() ||
      !category.trim() ||
      !image.trim() ||
      !ingredients.trim() ||
      !description.trim() ||
      newProduct.type.length === 0
) {
      setError('Заполните все обязательные поля')
      return
    }
    try {
      setLoading(true)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })

      if (!response.ok) {
        throw new Error('Не удалось добавить товар')
      }

      const createdProduct: Product = await response.json()
      onProductAdded(createdProduct)
    } catch {
      setError('Ошибка добавления товара. Проверьте работу сервера.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Добавление товара</h2>

      <label htmlFor="product-name">Название:</label>
      <input
        id="product-name"
        value={name}
        onChange={event => setName(event.target.value)}
        required
      />

      <label htmlFor="product-brand">Бренд:</label>
      <input
        id="product-brand"
        value={brand}
        onChange={event => setBrand(event.target.value)}
        required
      />

      <label htmlFor="product-category">Категория:</label>
      <select
        id="product-category"
        value={category}
        onChange={event => setCategory(event.target.value)}
        required
      >
        <option value="" disabled>Выберите категорию</option>

        {(Object.keys(productGroups) as ProductGroup[]).map(group => (
          <optgroup key={group} label={groupLabels[group]}>
            {productGroups[group].map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </optgroup>
        ))}
      </select>

      <label htmlFor="product-image">Путь к изображению:</label>
      <input
        id="product-image"
        value={image}
        onChange={event => setImage(event.target.value)}
        placeholder="/src/assets/images/example.jpg"
        required
      />

      <label htmlFor="product-type">Особенности:</label>
      <input
        id="product-type"
        value={type}
        onChange={event => setType(event.target.value)}
        required
      />

      <label htmlFor="product-ingredients">Состав:</label>
      <textarea
        id="product-ingredients"
        value={ingredients}
        onChange={event => setIngredients(event.target.value)}
        required
      />

      <label htmlFor="product-description">Описание:</label>
      <textarea
        id="product-description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        required
      />

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Добавление...' : 'Добавить товар'}
      </button>

      <button type="button" onClick={onCancel}>
        Отмена
      </button>
    </form>
  )
}

export default AddProductForm