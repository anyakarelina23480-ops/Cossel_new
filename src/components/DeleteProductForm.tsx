import { useState } from 'react'
import type { Product } from '../data/products'
import { API_URL } from '../data/config'

interface DeleteProductButtonProps {
  productId: Product['id']
  onDeleted: () => void
}

function DeleteProductButton({ productId, onDeleted }: DeleteProductButtonProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!window.confirm('Удалить этот товар?')) return

    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/${productId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Не удалось удалить товар')
      }

      // убираем товар из избранного, чтобы не остался "битый" id
      const favorites: Array<string | number> = JSON.parse(
        localStorage.getItem('favorites') || '[]'
      )
      localStorage.setItem(
        'favorites',
        JSON.stringify(
          favorites.filter((favId) => String(favId) !== String(productId))
        )
      )
      window.dispatchEvent(new Event('favoritesChanged'))

      onDeleted()
    } catch {
      setError('Ошибка удаления товара')
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" onClick={handleDelete} disabled={loading}>
        {loading ? 'Удаление...' : 'Удалить'}
      </button>

      {error && <p>{error}</p>}
    </>
  )
}

export default DeleteProductButton