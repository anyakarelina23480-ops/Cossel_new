import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Product as ProductType } from '../data/products'
import EditProductForm from '../components/EditProductForm'
import DeleteProductButton from '../components/DeleteProductForm'
import { API_URL } from '../data/config'

function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isAdmin] = useState(
    localStorage.getItem('isAdmin') === 'true'
  )
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites: Array<string | number> = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    )
    return favorites.some((favoriteId) => String(favoriteId) === String(id))
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/${id}`
        )

        if (response.status === 404) {
          setProduct(null)
          return
        }

        if (!response.ok) {
          throw new Error('Не удалось загрузить товар')
        }

        const data: ProductType = await response.json()
        setProduct(data)
      } catch {
        setError('Ошибка загрузки товара. Проверьте работу сервера.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  function toggleFavorite() {
    const favorites: Array<string | number> = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    )

    const updatedFavorites = isFavorite
      ? favorites.filter(
          (favoriteId) => String(favoriteId) !== String(id)
        )
      : [...favorites, String(id)]

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorite(!isFavorite)
    window.dispatchEvent(new Event('favoritesChanged'))
  }

  if (loading) {
    return <main className="product"><p>Загрузка товара...</p></main>
  }

  if (error) {
    return <main className="product"><p>{error}</p></main>
  }

  if (!product) {
    return <main className="product"><h1>Товар не найден</h1></main>
  }

  return (
    <main className="product">
      <h1>{product.name}</h1>

      {isAdmin && !isEditing && (
        <div className="admin-actions">
          <button type="button" onClick={() => setIsEditing(true)}>
            Редактировать
          </button>

          <DeleteProductButton
            productId={product.id}
            onDeleted={() => navigate('/products')}
          />
        </div>
      )}

      {isEditing ? (
        <EditProductForm
          product={product}
          onProductUpdated={(updatedProduct) => {
            setProduct(updatedProduct)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="product-left">
            <img src={product.image} alt={product.name} />

            <button type="button" onClick={toggleFavorite}>
              {isFavorite ? 'Убрать из избранного' : 'В избранное'}
            </button>
          </div>

          <div className="product-info">
            <p>Бренд: {product.brand}</p>
            <p>Категория: {product.category}</p>
            <p>{product.description}</p>
            <p>Состав: {product.ingredients}</p>
          </div>
        </>
      )}
    </main>
  )
}

export default Product