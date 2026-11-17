import { useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || ''
  )

  function handleNameChange(value: string) {
    setUserName(value)
    localStorage.setItem('userName', value)
  }

  return (
    <main className="mainpage">
      <h1>Cossel</h1>

      <p className="maintext">
        — индивидуальная подборка косметических средств.
      </p>

      <p className="maintext">
        Учитываем тип кожи, аллергены и прочие особенности.
      </p>

      <label htmlFor="userName">Ваше имя:</label>

      <input
        id="userName"
        type="text"
        placeholder="Введите имя"
        value={userName}
        onChange={(event) => handleNameChange(event.target.value)}
      />

      <Link to="/quiz" className="button-chooseproduct">
        Подобрать продукт
      </Link>
    </main>
  )
}

export default Home