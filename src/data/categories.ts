export type ProductGroup = 'eyes' | 'face' | 'lips'

export const productGroups: Record<ProductGroup, string[]> = {
  eyes: ['Тушь', 'Тени для век', 'Подводка', 'Карандаш для глаз'],
  face: ['Тональный крем', 'Пудра', 'Консилер', 'Румяна', 'Хайлайтер', 'Праймер', 'Бронзер'],
  lips: ['Помада', 'Блеск для губ', 'Карандаш для губ', 'Тинт'],
}

export const groupLabels: Record<ProductGroup, string> = {
  eyes: 'Глаза',
  face: 'Лицо',
  lips: 'Губы',
}