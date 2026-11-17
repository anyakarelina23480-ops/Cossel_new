import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Admin from './pages/Admin'
import Catalog from './pages/Catalog'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Product from './pages/Product'
import Quiz from './pages/Quiz'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Catalog />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App