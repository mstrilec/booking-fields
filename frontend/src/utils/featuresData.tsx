import { Clock, Handshake, MapPin, UserRound, Zap } from 'lucide-react'
import { ReactNode } from 'react'

interface FeatureItem {
	title: string
	text?: string
	icon?: ReactNode
	bg?: string
}

export const featuresData: FeatureItem[] = [
	{
		title: 'Каталог найближчих до тебе клубів',
		text: 'Час роботи, ціни, адреса і інша важлива інформація про спортивні клуби в додатку.',
		icon: <MapPin size={48} className='opacity-10 absolute bottom-4 right-4' />,
	},
	{
		title: 'Бронювання в декілька кліків',
		text: 'Оплата кортів - онлайн. Управління власними замовленнями в додатку',
		icon: <Zap size={48} className='opacity-10 absolute bottom-4 right-4' />,
	},
	{
		title: 'Миттєве підтвердження бронювання',
		icon: <Clock size={48} className='opacity-10 absolute bottom-4 right-4' />,
	},
	{
		title: 'Бронювання тренувань з тренером',
		icon: (
			<UserRound size={48} className='opacity-10 absolute bottom-4 right-4' />
		),
	},
	{
		title: 'Пошук спаринг-партнера будь-якого рівня в твоєму місті',
		icon: (
			<Handshake size={48} className='opacity-10 absolute bottom-4 right-4' />
		),
	},
	{
		title: 'Ми покращуємо наш сервіс кожен день!',
		bg: 'bg-gray-100',
	},
]
