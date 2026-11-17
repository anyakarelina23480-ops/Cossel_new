import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import ProductList from '../components/ProductList'
import AddProductForm from '../components/AddProductForm'
import { productGroups } from '../data/categories'
import { API_URL } from '../data/config'

function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(
  localStorage.getItem('isAdmin') === 'true'
)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Не удалось загрузить товары')
        }

        const data: Product[] = await response.json()
        setProducts(data)
      } catch {
        setError('Ошибка загрузки товаров. Проверьте работу сервера.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === '' || product.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <main className="catalog">
      <h1>Каталог</h1>
    
      {showForm && (
        <AddProductForm
          onProductAdded={(newProduct) => {
            setProducts((prevProducts) => [...prevProducts, newProduct])
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {isAdmin && (
        <div className="admin-actions">
          <button
            type="button"
            onClick={() => setShowForm(true)}
          >
            Добавить товар
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('isAdmin')
              setIsAdmin(false)
              setShowForm(false)
            }}
          >
            Выйти из режима администратора
          </button>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Все категории</option>

          {Object.entries(productGroups).map(([group, categories]) => (
            <optgroup
              key={group}
              label={
                group === 'eyes' ? 'Глаза' :
                group === 'face' ? 'Лицо' : 'Губы'
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Загрузка товаров...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <p>По вашему запросу ничего не найдено</p>
      )}
    </main>
  )
}

export default Catalog
