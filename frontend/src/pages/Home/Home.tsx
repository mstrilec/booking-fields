import {
	Clock,
	Dumbbell,
	Handshake,
	MapPin,
	Search,
	Star,
	UserRound,
	Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProsCard from '../../components/ProsCard/ProsCard'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import { getNearbyFields } from '../../services/fieldService'

const Home = () => {
	const [fields, setFields] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		const fetchFields = async () => {
			try {
				const data = await getNearbyFields()
				setFields(data.slice(0, 4))
			} catch (error) {
				console.error('Не вдалося завантажити поля:', error)
			}
		}
		fetchFields()
	}, [])

	return (
		<>
			<div className='bg-[#1171f5]'>
				<SearchBlock />
			</div>

			{/* Блок переваг */}
			<div className='container mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<ProsCard
					icon={<Clock size={32} />}
					title="Ми на зв'язку 24/7"
					text='Допоможемо у будь-який час доби'
				/>
				<ProsCard
					icon={<Zap size={32} />}
					title='Бронь в кілька кліків'
					text='Резервуй майданчик швидко й без дзвінків'
				/>
				<ProsCard
					icon={<Search size={32} />}
					title='Зручний пошук'
					text='Фільтруй за видом спорту, часом і містом'
				/>
				<ProsCard
					icon={<Dumbbell size={32} />}
					title='Усі види спорту'
					text='Від футболу до настільного тенісу — обирай свій'
				/>
			</div>

			<div className='container mx-auto px-4 mt-20 bg-[#f7f9fc] py-8 rounded-2xl shadow-lg'>
				<h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
					<Star className='text-yellow-500' size={24} /> Популярні поля
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{fields.map((field, index) => (
						<div
							key={index}
							className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer flex flex-col justify-between'
						>
							{field.photos && field.photos.length > 0 ? (
								<img
									src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
										field.photos[0].photo_reference
									}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
									alt={field.name}
									className='w-full h-48 object-cover'
								/>
							) : (
								<div className='w-full h-48 flex items-center justify-center bg-gray-100'>
									<img
										src={field.icon}
										alt={field.name}
										className='w-16 h-16'
									/>
								</div>
							)}

							<div className='p-4 flex flex-col flex-grow'>
								<h3 className='text-xl font-semibold text-[#162328] mb-1'>
									{field.name}
								</h3>
								<p className='text-gray-500 text-sm mb-2'>{field.vicinity}</p>

								<div className='flex items-center gap-2 mb-4'>
									<span className='text-yellow-400 text-lg'>★</span>
									<span className='text-gray-700'>
										{field.rating ?? 'Немає оцінки'}
									</span>
									<span className='text-gray-400 text-sm'>
										({field.user_ratings_total ?? 0})
									</span>
								</div>

								<button
									className='mt-auto bg-[#1171f5] text-white rounded-xl py-2 px-4 text-center font-semibold hover:bg-[#0e5ed1] transition duration-300 cursor-pointer'
									onClick={() => navigate(`/field/${field.place_id}`)}
								>
									Забронювати
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='container mx-auto px-4 mt-20'>
				<h2 className='text-2xl font-bold mb-6'>Все просто, переконайся сам</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[
						{
							title: 'Каталог найближчих до тебе клубів',
							text: 'Час роботи, ціни, адреса і інша важлива інформація про спортивні клуби в додатку.',
							icon: (
								<MapPin
									size={48}
									className='opacity-10 absolute bottom-4 right-4'
								/>
							),
						},
						{
							title: 'Бронювання в декілька кліків',
							text: 'Оплата кортів - онлайн. Управління власними замовленнями в додатку',
							icon: (
								<Zap
									size={48}
									className='opacity-10 absolute bottom-4 right-4'
								/>
							),
						},
						{
							title: 'Миттєве підтвердження бронювання',
							text: '',
							icon: (
								<Clock
									size={48}
									className='opacity-10 absolute bottom-4 right-4'
								/>
							),
						},
						{
							title: 'Бронювання тренувань з тренером',
							text: '',
							icon: (
								<UserRound
									size={48}
									className='opacity-10 absolute bottom-4 right-4'
								/>
							),
						},
						{
							title: 'Пошук спаринг-партнера будь-якого рівня в твоєму місті',
							text: '',
							icon: (
								<Handshake
									size={48}
									className='opacity-10 absolute bottom-4 right-4'
								/>
							),
						},
						{
							title: 'Ми покращуємо наш сервіс кожен день!',
							text: '',
							icon: null,
							bg: 'bg-gray-100',
						},
					].map((item, idx) => (
						<div
							key={idx}
							className={`relative rounded-2xl p-6 min-h-[160px] ${
								item.bg ?? 'bg-[#3d4ef3] text-white'
							} ${item.bg ? 'text-black' : 'text-white'}`}
						>
							<h3 className='font-bold text-lg'>{item.title}</h3>
							{item.text && <p className='text-sm mt-2'>{item.text}</p>}
							{item.icon}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Home
