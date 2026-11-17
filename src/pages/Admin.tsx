import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (login === '0195778' && password === '12345') {
      localStorage.setItem('isAdmin', 'true')
      setError('')
      navigate('/products')
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <main className="admin-login">
      <h1>Вход администратора</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="admin-login">Логин:</label>
        <input
          id="admin-login"
          type="text"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          required
        />

        <label htmlFor="admin-password">Пароль:</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Войти</button>

        {error && <p>{error}</p>}
      </form>
    </main>
  )
}

export default Admin