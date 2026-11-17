import type { Product } from '../data/products'
import ProductCard from './ProductCard'

interface ProductListProps {
  products: Product[]
}

function ProductList({ products }: ProductListProps) {
  return (
    <section className="catalog-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          brand={product.brand}
          category={product.category}
          description={product.description}
          image={product.image}
        />
      ))}
    </section>
  )
}

export default ProductList