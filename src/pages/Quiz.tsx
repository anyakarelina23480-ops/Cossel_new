import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'
import { productGroups, type ProductGroup } from '../data/categories'
import { API_URL } from '../data/config'

type Allergen = 'paraben' | 'sulfate' | 'parfum' | 'alcohol'

interface FeatureOption {
  value: string
  label: string
}

const featureOptions: Record<ProductGroup, FeatureOption[]> = {
  eyes: [
    { value: 'чувствительные', label: 'Чувствительные' },
    { value: 'средние', label: 'Средние' },
    { value: 'нормальные', label: 'Не чувствительные' },
  ],
  face: [
    { value: 'сухая', label: 'Сухая' },
    { value: 'жирная', label: 'Жирная' },
    { value: 'нормальная', label: 'Нормальная' },
    { value: 'комбинированная', label: 'Комбинированная' },
  ],
  lips: [
    { value: 'сухие', label: 'Сухие' },
    { value: 'нормальные', label: 'Нормальные' },
    { value: 'увлажнённые', label: 'Увлажнённые' },
  ],
}

const allergenKeywords: Record<Allergen, string[]> = {
  paraben: ['paraben'],
  sulfate: ['sulfate', 'sulphate'],
  parfum: ['parfum', 'fragrance', 'aroma', 'perfume'],
  alcohol: ['alcohol', 'ethanol', 'alcohol denat.', 'ethyl alcohol'],
}

const allergenOptions: { value: Allergen; label: string }[] = [
  { value: 'paraben', label: 'Парабены' },
  { value: 'sulfate', label: 'Сульфаты' },
  { value: 'parfum', label: 'Отдушки' },
  { value: 'alcohol', label: 'Спирт' },
]

function Quiz() {
  const [currentStep, setCurrentStep] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState('')
  const [feature, setFeature] = useState('')
  const [allergies, setAllergies] = useState<Allergen[]>([])
  const [result, setResult] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Не удалось загрузить товары')
        }

        const data: Product[] = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
        setError('Не удалось загрузить товары. Проверьте работу сервера.')
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [])

  const selectedGroup = Object.entries(productGroups).find(
    ([, categories]) => categories.includes(category)
  )?.[0] as ProductGroup | undefined

  function goToNextStep() {
    if (currentStep === 1 && !category) {
      alert('Выберите тип продукта')
      return
    }

    if (currentStep === 2 && !feature) {
      alert('Выберите вариант ответа')
      return
    }

    setCurrentStep((step) => step + 1)
  }

  function goToPreviousStep() {
    setCurrentStep((step) => step - 1)
  }

  function toggleAllergen(allergen: Allergen) {
    setAllergies((previous) =>
      previous.includes(allergen)
        ? previous.filter((item) => item !== allergen)
        : [...previous, allergen]
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading || error) {
      return
    }

    const matchedProducts = products.filter((product) => {
      if (product.category !== category) {
        return false
      }

      if (!product.type.includes(feature)) {
        return false
      }

      const ingredients = product.ingredients.toLowerCase()

      const hasAllergen = allergies.some((allergen) =>
        allergenKeywords[allergen].some((keyword) =>
          ingredients.includes(keyword)
        )
      )

      return !hasAllergen
    })

    setResult(matchedProducts)
  }

  const userName = localStorage.getItem('userName') || ''

  if (loading) {
    return (
      <main>
        <p>Загрузка товаров...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <p>Обновите страницу после запуска сервера.</p>
      </main>
    )
  }

  return (
    <main>
      {result === null ? (
        <form
          id="quizForm"
          onSubmit={handleSubmit}
        >
          {currentStep === 1 && (
            <div className="quiz-step">
              <h2>Шаг 1 из 3</h2>

              <label htmlFor="quizCategory">
                Тип продукта:
              </label>

              <select
                id="quizCategory"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setFeature('')
                }}
                required
              >
                <option value="" disabled>
                  Выберите продукт
                </option>

                <optgroup label="Глаза">
                  {productGroups.eyes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Лицо">
                  {productGroups.face.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Губы">
                  {productGroups.lips.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </optgroup>
              </select>

              <button
                type="button"
                className="button-next"
                onClick={goToNextStep}
              >
                Далее
              </button>
            </div>
          )}

          {currentStep === 2 && selectedGroup && (
            <div className="quiz-step">
              <h2>Шаг 2 из 3</h2>

              <fieldset>
                <legend>
                  {selectedGroup === 'eyes'
                    ? 'Насколько чувствительны ваши глаза?'
                    : selectedGroup === 'face'
                      ? 'Какой у вас тип кожи?'
                      : 'Какое состояние ваших губ?'}
                </legend>

                {featureOptions[selectedGroup].map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name="step2Answer"
                      value={option.value}
                      checked={feature === option.value}
                      onChange={() => setFeature(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>

              <button
                type="button"
                className="button-prev"
                onClick={goToPreviousStep}
              >
                Назад
              </button>

              <button
                type="button"
                className="button-next"
                onClick={goToNextStep}
              >
                Далее
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="quiz-step">
              <h2>Шаг 3 из 3</h2>

              <fieldset>
                <legend>
                  Какие компоненты вы не переносите (если такие есть)?
                </legend>

                {allergenOptions.map((allergen) => (
                  <label key={allergen.value}>
                    <input
                      type="checkbox"
                      checked={allergies.includes(allergen.value)}
                      onChange={() => toggleAllergen(allergen.value)}
                    />
                    {allergen.label}
                  </label>
                ))}
              </fieldset>

              <button
                type="button"
                className="button-prev"
                onClick={goToPreviousStep}
              >
                Назад
              </button>

              <button
                type="submit"
                className="button-next"
              >
                Готово
              </button>
            </div>
          )}
        </form>
      ) : (
        <section className="quiz-result">
          {result.length === 0 ? (
            <>
              <h2>К сожалению, ничего не найдено</h2>
              <p>Попробуйте изменить параметры подбора.</p>
            </>
          ) : (
            <>
              <h2>
                {userName
                  ? `${userName}, мы подобрали для вас:`
                  : 'Мы подобрали для вас:'}
              </h2>

              <div className="catalog-grid">
                {result.map((product) => (
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
              </div>
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default Quiz
