import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <nav className="navigation">
        <Link to="/">
          <i className="fa-solid fa-house"></i>
          Главная
        </Link>

        <Link to="/products">
          <i className="fa-solid fa-store"></i>
          Каталог
        </Link>

        <Link to="/favorites">
          <i className="fa-solid fa-heart"></i>
          Избранное
        </Link>
      </nav>
    </header>
  )
}

export default Header