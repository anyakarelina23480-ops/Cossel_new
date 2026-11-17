import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  id: string | number
  name: string
  brand: string
  category: string
  description: string
  image: string
}

function ProductCard({
  id,
  name,
  category,
  image,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(() => {
  const favorites: Array<string | number> = JSON.parse(
    localStorage.getItem('favorites') || '[]'
  )
  return favorites.some((favoriteId) => String(favoriteId) === String(id))
})

useEffect(() => {
    function syncFavorite() {
      const favorites: Array<string | number> = JSON.parse(
        localStorage.getItem('favorites') || '[]'
      )

      setIsFavorite(
        favorites.some((favoriteId) => String(favoriteId) === String(id))
      )
    }

    window.addEventListener('favoritesChanged', syncFavorite)

    return () => {
      window.removeEventListener('favoritesChanged', syncFavorite)
    }
  }, [id])

  function toggleFavorite() {
    const favorites: Array<string | number> = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    )

    const updatedFavorites = isFavorite
      ? favorites.filter((favoriteId) => String(favoriteId) !== String(id))
      : [...favorites, String(id)]

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorite(!isFavorite)
    window.dispatchEvent(new Event('favoritesChanged'))
  }

  return (
    <article className="product-card">
      <img src={image} alt={name} />

      <h3>{name}</h3>
      <p>{category}</p>

       <div className="product-actions">
        <Link to={`/products/${id}`} className="btn-details">
          Подробнее
        </Link>

        <button
          type="button"
          className="btn-favorite-icon"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard