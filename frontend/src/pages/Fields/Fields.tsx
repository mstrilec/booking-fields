import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import DropDown from '../../components/DropDown/DropDown'
import Map from '../../components/Map/Map'
import { getNearbyFields } from '../../services/fieldService'

const Fields = () => {
	const [fields, setFields] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [duration, setDuration] = useState<number>(60)
	const [sport, setSport] = useState<number>(0)
	const navigate = useNavigate()
	const [businessStatus, setBusinessStatus] = useState<string>('all')
	const [ratingSort, setRatingSort] = useState<string>('none')
	const [reviewsSort, setReviewsSort] = useState<string>('none')
	const [priceSort, setPriceSort] = useState<string>('none')
	const [filteredFields, setFilteredFields] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [city, setCity] = useState<string>('Київ')

	console.log(fields)

	const optionsCities = [
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

	const optionsSport = [
		{ label: 'Всі види спорту', value: 0 },
		{ label: '⚽ Футбол', value: 1 },
		{ label: '🏀 Баскетбол', value: 2 },
		{ label: '🎾 Теніс', value: 3 },
		{ label: '🏐 Волейбол', value: 4 },
		{ label: '🏓 Настільний теніс', value: 5 },
		{ label: '🏸 Бадмінтон', value: 6 },
		{ label: '🏋️‍♂️ Фітнес', value: 7 },
		{ label: '🏊‍♂️ Плавання', value: 8 },
		{ label: '🚴‍♂️ Велоспорт', value: 9 },
		{ label: '🏇 Коні', value: 10 },
	]

	const optionsTime = [
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

	const optionsBusinessStatus = [
		{ label: 'Всі статуси', value: 'all' },
		{ label: '✅ Відкриті', value: 'OPERATIONAL' },
		{ label: '⏱️ Тимчасово закриті', value: 'CLOSED_TEMPORARILY' },
		{ label: '❌ Постійно закриті', value: 'CLOSED_PERMANENTLY' },
	]

	const optionsRating = [
		{ label: 'Рейтинг', value: 'none' },
		{ label: '⭐ Рейтинг: високий-низький', value: 'desc' },
		{ label: '⭐ Рейтинг: низький-високий', value: 'asc' },
	]

	const optionsReviews = [
		{ label: 'Кількість відгуків', value: 'none' },
		{ label: '👥 Відгуки: багато-мало', value: 'desc' },
		{ label: '👤 Відгуки: мало-багато', value: 'asc' },
	]

	const optionsPrice = [
		{ label: 'Ціна', value: 'none' },
		{ label: '💰 Ціна: висока-низька', value: 'desc' },
		{ label: '💸 Ціна: низька-висока', value: 'asc' },
	]

	useEffect(() => {
		const fetchFields = async () => {
			try {
				setLoading(true)
				const fieldsData = await getNearbyFields(city)
				setFields(fieldsData)
				setError(null)
			} catch (err) {
				setError('Не вдалося завантажити дані про клуби')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchFields()
	}, [city])

	useEffect(() => {
		if (!fields.length) return

		let result = [...fields]

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim()
			result = result.filter(
				field =>
					field.name.toLowerCase().includes(query) ||
					(field.vicinity && field.vicinity.toLowerCase().includes(query))
			)
		}

		if (businessStatus !== 'all') {
			result = result.filter(field => field.business_status === businessStatus)
		}

		if (ratingSort !== 'none') {
			result = [...result].sort((a, b) => {
				const ratingA = a.rating || 0
				const ratingB = b.rating || 0
				return ratingSort === 'desc' ? ratingB - ratingA : ratingA - ratingB
			})
		}

		if (reviewsSort !== 'none') {
			result = [...result].sort((a, b) => {
				const reviewsA = a.user_ratings_total || 0
				const reviewsB = b.user_ratings_total || 0
				return reviewsSort === 'desc'
					? reviewsB - reviewsA
					: reviewsA - reviewsB
			})
		}

		if (priceSort !== 'none') {
			result = [...result].sort((a, b) => {
				const priceA = a.price || 0
				const priceB = b.price || 0
				return priceSort === 'desc' ? priceB - priceA : priceA - priceB
			})
		}

		setFilteredFields(result)
	}, [fields, businessStatus, ratingSort, reviewsSort, priceSort, searchQuery])

	console.log('sport: ', sport)
	console.log('duration: ', duration)

	if (loading) return <div className='loading'>Завантаження...</div>
	if (error) return <div className='error'>{error}</div>

	return (
		<div className='container mx-auto px-4 mt-[24px] grid grid-cols-2 gap-12'>
			<div>
				<Breadcrumbs />
				<div>
					<div className='flex items-center gap-4 w-full mt-4'>
						<DropDown
							options={optionsBusinessStatus}
							placeholder='Всі статуси'
							width='18rem'
							onChange={option => setBusinessStatus(option.value)}
						/>
						<DropDown
							options={optionsRating}
							placeholder='Рейтинг'
							width='18rem'
							onChange={option => setRatingSort(option.value)}
						/>
						<DropDown
							options={optionsReviews}
							placeholder='Кількість відгуків'
							width='24rem'
							onChange={option => setReviewsSort(option.value)}
						/>
						<DropDown
							options={optionsPrice}
							placeholder='Ціна'
							width='18rem'
							onChange={option => setPriceSort(option.value)}
						/>
					</div>
				</div>
				<div className='flex items-center h-[max-content] gap-4 mt-4 mb-4'>
					<h2 className='text-3xl font-semibold'>
						Клуби в місті {city}
					</h2>
					<DropDown
						options={optionsCities}
						placeholder={city}
						width='20rem'
						onChange={option => setCity(option.value)}
					/>
				</div>
				<div className='relative w-full'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
					<input
						type='search'
						placeholder='Введіть назву клубу'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='bg-white rounded-xl shadow-lg max-h-60 overflow-auto text-[#162328] px-4 py-3 pl-10 w-full 
             focus:border-[#1171f5] focus:ring-2 focus:ring-[#1171f5] focus:outline-none 
             border border-transparent transition duration-300'
					/>
				</div>
				<p className='text-gray-400 text-lg mt-4'>
					Ми знайшли {filteredFields.length} варіантів
				</p>
				<hr className='mt-4 border-gray-400' />
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
					{filteredFields.map((field, index) => (
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
			<div
				style={{ position: 'sticky', top: '10%', zIndex: 10 }}
				className='mt-13 h-[80vh] rounded-2xl shadow-lg overflow-hidden'
			>
				<Map fields={fields} />
			</div>
		</div>
	)
}

export default Fields
