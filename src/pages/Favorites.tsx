import { useEffect, useState } from 'react'
import ProductList from '../components/ProductList'
import type { Product } from '../data/products'
import { API_URL } from '../data/config'

function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFavorites() {
      try {
        setError('')

        const favorites: Array<string | number> = JSON.parse(
          localStorage.getItem('favorites') || '[]'
        )

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Не удалось загрузить товары')
        }

        const products: Product[] = await response.json()

        const savedProducts = products.filter((product) =>
          favorites.some(
            (favoriteId) => String(favoriteId) === String(product.id)
          )
        )

        setFavoriteProducts(savedProducts)
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error)
        setError('Не удалось загрузить избранное. Проверьте работу сервера.')
        setFavoriteProducts([])
      } finally {
        setLoading(false)
      }
    }

    void loadFavorites()

    window.addEventListener('favoritesChanged', loadFavorites)

    return () => {
      window.removeEventListener('favoritesChanged', loadFavorites)
    }
  }, [])

  return (
    <main className="favorites">
      <h1>Избранное</h1>

      {loading ? (
        <p>Загрузка избранного...</p>
      ) : error ? (
        <p>{error}</p>
      ) : favoriteProducts.length > 0 ? (
        <ProductList products={favoriteProducts} />
      ) : (
        <p>У вас пока нет избранных товаров.</p>
      )}
    </main>
  )
}

export default Favorites