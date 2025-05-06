import { setHours } from 'date-fns/setHours'
import { setMinutes } from 'date-fns/setMinutes'
import { User } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AdminFieldEditor from '../../components/AdminFieldEditor/AdminFieldEditor'
import DropDown from '../../components/DropDown/DropDown'
import { useAuth } from '../../context/AuthContext'
import { createBooking } from '../../services/bookingService'
import { createField, getFieldByPlaceId } from '../../services/fieldService'

const FieldPage = () => {
	const { placeId } = useParams()
	const [field, setField] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [time, setTime] = useState<Date | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { user } = useAuth()
	const [duration, setDuration] = useState<number>(60)
	const [priceError, setPriceError] = useState('')

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
		const fetchField = async () => {
			try {
				setLoading(true)
				let data = await getFieldByPlaceId(placeId)

				if (!data) {
					data = await createField(placeId)
				}

				setField(data)
				setError(null)
			} catch (err) {
				setError('Не вдалося завантажити інформацію про поле')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchField()
	}, [placeId])

	const handleSubmit = async () => {
		console.log('startDate:', startDate)
		console.log('time:', time)
		console.log('user:', user)
		console.log('duration:', duration)
		console.log('field:', field)

		if (!startDate || !time || !user) {
			console.log('Поля не заповнені')
			toast.error('Будь ласка, заповніть усі поля')
			return
		}

		try {
			setIsSubmitting(true)
			const startTime = new Date(
				startDate.getFullYear(),
				startDate.getMonth(),
				startDate.getDate(),
				time.getHours(),
				time.getMinutes()
			)

			const endTime = new Date(startTime.getTime() + duration * 60000)

			console.log('Start field id:', placeId)

			const fieldFromBD = await createField(placeId)

			console.log('Field From BD:', fieldFromBD)

			console.log('Створюємо бронювання з параметрами:', {
				startTime,
				endTime,
				fieldId: fieldFromBD.id,
			})

			await createBooking({
				startTime,
				endTime,
				fieldId: fieldFromBD.id,
			})

			toast.success('Бронювання успішно створено!')
		} catch (error) {
			console.error(error)
			toast.error('Помилка при створенні бронювання')
		} finally {
			setIsSubmitting(false)
		}
	}

	console.log('field:', field)

	if (loading) return <div className='loading'>Завантаження...</div>
	if (error) return <div className='error'>{error}</div>

	return (
		<div className='container mx-auto px-4 mt-[24px]'>
			<div className='flex justify-between'>
				<div>
					{field.photos && field.photos.length > 0 ? (
						<img
							src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${
								field.photos[0].photo_reference
							}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
							alt={field.name}
							className='w-full h-64 object-cover rounded-xl mb-6'
						/>
					) : (
						<div className='w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl mb-6'>
							<span className='text-gray-500 text-xl'>Немає зображення</span>
						</div>
					)}

					<h2 className='text-3xl font-semibold mb-4'>{field.name}</h2>
					<p className='text-lg text-gray-600 mb-2'>{field.address}</p>
					<p className='text-lg text-gray-600 mb-2'>
						Номер телефону: {field.phoneNumber ?? 'Немає даних'}
					</p>
					<p className='text-lg text-gray-600 mb-2'>
						Ціна за годину: {field.price ?? 'Немає даних'}
						{field.price && ' ₴'}
					</p>
					<p className='text-lg text-gray-600 mb-2'>
						Додаткова інформація: {field.additionalInfo ?? 'Немає даних'}
					</p>
					{field.website && (
						<Link
							to={field.website}
							target='_blank'
							rel='noopener noreferrer'
							className='text-blue-500 underline'
						>
							Вебсайт
						</Link>
					)}
					{user?.role === 'admin' && (
						<AdminFieldEditor
							field={field}
							setField={setField}
							placeId={placeId}
						/>
					)}
				</div>

				<div className='flex flex-col items-center justify-center gap-4 bg-[#1171f5] rounded-2xl p-6 h-96'>
					<h3 className='text-2xl text-white font-semibold'>Бронювання</h3>
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
						width='100%'
						onChange={option => setDuration(option.value)}
					/>
					<button
						className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-5 py-2 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300 mt-4'
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Бронюємо...' : 'Оформити'}
					</button>
				</div>
			</div>
			<div className='mt-6'>
				<h2 className='text-2xl font-semibold mb-4'>Відгуки</h2>
				{field.reviews && field.reviews.length > 0 ? (
					<ul className='space-y-4'>
						{field.reviews.map((review, index) => (
							<li
								key={index}
								className='flex items-start gap-4 p-4 bg-gray-100 rounded-xl shadow-sm'
							>
								<div className='flex-shrink-0'>
									<div className='bg-blue-500 text-white p-2 rounded-full'>
										<User size={24} />
									</div>
								</div>
								<div>
									<p className='font-semibold text-gray-800'>
										{review.author_name}
									</p>
									<p className='text-gray-600 mt-1'>{review.text}</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-500'>Відгуків немає.</p>
				)}
			</div>
		</div>
	)
}

export default FieldPage
