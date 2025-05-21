import { SortOption } from '../types/interfaces'

export const optionsCities = [
	{ label: 'Київ', value: 'Київ' },
	{ label: 'Львів', value: 'Львів' },
	{ label: 'Харків', value: 'Харків' },
	{ label: 'Одеса', value: 'Одеса' },
	{ label: 'Дніпро', value: 'Дніпро' },
	{ label: 'Запоріжжя', value: 'Запоріжжя' },
	{ label: 'Вінниця', value: 'Вінниця' },
	{ label: 'Чернівці', value: 'Чернівці' },
	{ label: 'Івано-Франківськ', value: 'Івано-Франківськ' },
	{ label: 'Тернопіль', value: 'Тернопіль' },
	{ label: 'Луцьк', value: 'Луцьк' },
	{ label: 'Рівне', value: 'Рівне' },
	{ label: 'Житомир', value: 'Житомир' },
	{ label: 'Хмельницький', value: 'Хмельницький' },
	{ label: 'Черкаси', value: 'Черкаси' },
	{ label: 'Полтава', value: 'Полтава' },
	{ label: 'Суми', value: 'Суми' },
	{ label: 'Чернігів', value: 'Чернігів' },
	{ label: 'Миколаїв', value: 'Миколаїв' },
	{ label: 'Херсон', value: 'Херсон' },
	{ label: 'Кропивницький', value: 'Кропивницький' },
	{ label: 'Ужгород', value: 'Ужгород' },
]

export const optionsBusinessStatus = [
	{ label: 'Всі', value: 'all' },
	{ label: '✅ Відкриті', value: 'OPERATIONAL' },
	{ label: '⏱️ Тимчасово', value: 'CLOSED_TEMPORARILY' },
	{ label: '❌ Закриті', value: 'CLOSED_PERMANENTLY' },
]

export const optionsRating = [
	{ label: 'Рейтинг', value: 'none' },
	{ label: '⭐ ↓', value: 'desc' },
	{ label: '⭐ ↑', value: 'asc' },
]

export const optionsReviews = [
	{ label: 'Відгуки', value: 'none' },
	{ label: '👥 ↓', value: 'desc' },
	{ label: '👤 ↑', value: 'asc' },
]

export const optionsPrice = [
	{ label: 'Ціна', value: 'none' },
	{ label: '💰 ↓', value: 'desc' },
	{ label: '💸 ↑', value: 'asc' },
]

export const optionsTime = [
	{ label: 'На 1 годину', value: 60 },
	{ label: 'На 2 години', value: 120 },
	{ label: 'На 3 години', value: 180 },
	{ label: 'На 4 години', value: 240 },
	{ label: 'На 5 годин', value: 300 },
	{ label: 'На 6 годин', value: 360 },
	{ label: 'На 7 годин', value: 420 },
	{ label: 'На 8 годин', value: 480 },
	{ label: 'На 9 годин', value: 540 },
	{ label: 'На 10 годин', value: 600 },
	{ label: 'На 11 годин', value: 660 },
	{ label: 'На 12 годин', value: 720 },
]

export const sortOptions: SortOption[] = [
	{ label: 'Датою ↑', value: 'date-asc' },
	{ label: 'Датою ↓', value: 'date-desc' },
	{ label: 'Статусом', value: 'status' },
	{ label: 'Часом', value: 'time' },
]
