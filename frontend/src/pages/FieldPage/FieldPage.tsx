import { setHours } from 'date-fns/setHours'
import { setMinutes } from 'date-fns/setMinutes'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AdminFieldEditor from '../../components/AdminFieldEditor/AdminFieldEditor'
import CommentSection from '../../components/CommentSection/CommentSection'
import DropDown from '../../components/DropDown/DropDown'
import { useAuth } from '../../context/AuthContext'
import { createBooking } from '../../services/bookingService'
import { createField, getFieldByPlaceId } from '../../services/fieldService'
import { Field } from '../../types/interfaces'
import { optionsTime } from '../../utils/constants'

const FieldPage = () => {
	const { placeId } = useParams()
	const [field, setField] = useState<Field | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [time, setTime] = useState<Date | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { user } = useAuth()
	const [duration, setDuration] = useState<number>(60)

	useEffect(() => {
		const fetchField = async () => {
			try {
				setLoading(true)
				if (!placeId) return
				let data = await getFieldByPlaceId(placeId)

				if (!data) {
					data = await createField(placeId)
				}

				setField(data)
				setError(null)
			} catch {
				setError(
					'Не вдалося завантажити інформацію про поле' as unknown as null
				)
			} finally {
				setLoading(false)
			}
		}

		fetchField()

		const savedDate = sessionStorage.getItem('bookingDate')
		const savedTime = sessionStorage.getItem('bookingTime')

		if (savedDate) {
			setStartDate(new Date(savedDate))
		}

		if (savedTime) {
			setTime(new Date(savedTime))
		}
	}, [placeId])

	const handleSubmit = async () => {
		if (!user) {
			toast.error('Для бронювання необхідно авторизуватися')
			return
		}

		if (!startDate || !time) {
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
			if (!placeId) return
			const fieldFromBD = await createField(placeId)

			await createBooking({
				startTime,
				endTime,
				fieldId: fieldFromBD.id,
			})

			toast.success('Бронювання успішно створено!')

			sessionStorage.removeItem('bookingDate')
			sessionStorage.removeItem('bookingTime')
		} catch {
			toast.error('Помилка при створенні бронювання')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCommentAdded = async () => {
		try {
			if (!placeId) return
			const updatedField = await getFieldByPlaceId(placeId)
			setField(updatedField)
		} catch {
			toast.error('Не вдалося оновити коментарі')
		}
	}

	if (loading)
		return <Loader2 className='animate-spin text-[#1171f5]' size={48} />
	if (error) return <div className='error'>{error}</div>

	return (
		<div className='container mx-auto px-4 mt-[24px]'>
			<div className='flex justify-between'>
				<div>
					{field?.photos && field.photos.length > 0 ? (
						<img
							src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${
								field.photos[0].photo_reference
							}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
							alt={field.name}
							className='w-full h-64 object-cover rounded-xl mb-6'
							referrerPolicy='no-referrer'
							onError={e => {
								e.currentTarget.src = '/fallback-image.jpg'
							}}
						/>
					) : (
						<div className='w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl mb-6'>
							<span className='text-gray-500 text-xl'>Немає зображення</span>
						</div>
					)}

					<h2 className='text-3xl font-semibold mb-4'>{field?.name}</h2>
					<p className='text-lg text-gray-600 mb-2'>{field?.address}</p>
					<p className='text-lg text-gray-600 mb-2'>
						Номер телефону: {field?.phoneNumber ?? 'Немає даних'}
					</p>
					<p className='text-lg text-gray-600 mb-2'>
						Ціна за годину: {field?.price ?? 'Немає даних'}
						{field?.price && ' ₴'}
					</p>
					<p className='text-lg text-gray-600 mb-2'>
						Додаткова інформація: {field?.additionalInfo ?? 'Немає даних'}
					</p>
					{field?.website && (
						<Link
							to={field?.website}
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

					{!user ? (
						<div className='text-white text-center mb-2'>
							<p>Для бронювання необхідно авторизуватися</p>
							<Link
								to='/login'
								className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-5 py-2 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300 mt-4 inline-block'
							>
								Увійти
							</Link>
						</div>
					) : (
						<>
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
								onChange={option => {
									const durationValue =
										typeof option.value === 'string'
											? parseInt(option.value, 10)
											: option.value
									setDuration(durationValue)
								}}
							/>
							<button
								className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-5 py-2 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300 mt-4'
								onClick={handleSubmit}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Бронюємо...' : 'Оформити'}
							</button>
						</>
					)}
				</div>
			</div>
			<div className='mt-6'>
				<CommentSection
					onCommentAdded={handleCommentAdded}
					placeId={placeId}
					comments={field?.comments}
					googleReviews={field?.reviews}
				/>
			</div>
		</div>
	)
}

export default FieldPage
