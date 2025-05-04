import { setHours } from 'date-fns/setHours'
import { setMinutes } from 'date-fns/setMinutes'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import DropDown from '../../components/DropDown/DropDown'
import Map from '../../components/Map/Map'
import { getNearbyFields } from '../../services/fieldService'

const Fields = () => {
	const [fields, setFields] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [time, setTime] = useState<Date | null>(null)
	const [duration, setDuration] = useState<number>(60)
	const [sport, setSport] = useState<number>(0)
	const navigate = useNavigate()

	console.log(fields)

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

	useEffect(() => {
		const fetchFields = async () => {
			try {
				setLoading(true)
				const fieldsData = await getNearbyFields()
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
	}, [])

	console.log('sport: ', sport)
	console.log('duration: ', duration)

	if (loading) return <div className='loading'>Завантаження...</div>
	if (error) return <div className='error'>{error}</div>

	return (
		<div className='container mx-auto px-4 mt-[24px] grid grid-cols-2 gap-12'>
			<div>
				<Breadcrumbs />
				<div>
					<div className='flex items-center gap-4 w-full'>
						<DropDown
							options={optionsSport}
							placeholder='Всі види спорту'
							width='20rem'
							onChange={option => setSport(option.value)}
						/>
						<div className='relative'>
							<DatePicker
								selected={startDate}
								onChange={date => setStartDate(date)}
								className='bg-white rounded-xl shadow-lg text-[#162328] px-4 py-3 w-full focus:outline-none'
								dateFormat='dd/MM/yyyy'
								minDate={new Date()}
								placeholderText='Виберіть дату'
							/>
						</div>
						<div className='relative'>
							<DatePicker
								selected={time}
								onChange={date => setTime(date)}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={30}
								timeCaption='Час'
								dateFormat='HH:mm'
								placeholderText='Будь-який час'
								className='bg-white rounded-xl shadow-lg text-[#162328] px-4 py-3 w-full focus:outline-none'
								minTime={setHours(setMinutes(new Date(), 0), 8)}
								maxTime={setHours(setMinutes(new Date(), 0), 22)}
							/>
						</div>
						<DropDown
							options={optionsTime}
							placeholder='На 1 годину'
							width='16rem'
							onChange={option => setDuration(option.value)}
						/>
					</div>
				</div>
				<h2 className='text-3xl font-semibold mt-8 mb-4'>
					Клуби в місті <span className='text-[#1171f5]'>Чернівці</span>
				</h2>
				<div className='relative w-full'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
					<input
						type='search'
						placeholder='Введіть назву клубу'
						className='bg-white rounded-xl shadow-lg max-h-60 overflow-auto text-[#162328] px-4 py-3 pl-10 w-full 
             focus:border-[#1171f5] focus:ring-2 focus:ring-[#1171f5] focus:outline-none 
             border border-transparent transition duration-300'
					/>
				</div>
				<p className='text-gray-400 text-lg mt-4'>
					Ми знайшли {fields.length} варіантів
				</p>
				<hr className='mt-4 border-gray-400' />
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
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
