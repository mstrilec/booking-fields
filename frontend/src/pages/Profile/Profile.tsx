import { CalendarCheck, Clock3, MapPin, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import DropDown from '../../components/DropDown/DropDown'
import { useAuth } from '../../context/AuthContext'
import {
	getUserBookings,
	updateBookingStatus,
} from '../../services/bookingService'
import { getFieldByPlaceId } from '../../services/fieldService'

interface SortOption {
	label: string
	value: string
}

const Profile = () => {
	const { user, logout } = useAuth()
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(true)
	const [sortOption, setSortOption] = useState('date-asc')

	const sortOptions: SortOption[] = [
		{ label: 'Датою ↑', value: 'date-asc' },
		{ label: 'Датою ↓', value: 'date-desc' },
		{ label: 'Статусом', value: 'status' },
		{ label: 'Часом', value: 'time' },
	]

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const data = await getUserBookings()

				const bookingsWithField = await Promise.all(
					data.map(async booking => {
						try {
							const fullField = await getFieldByPlaceId(booking.field.placeId)
							return { ...booking, field: fullField }
						} catch (err) {
							return booking
						}
					})
				)

				setBookings(bookingsWithField)
			} catch (err) {
				throw new Error('Не вдалося завантажити бронювання')
			} finally {
				setLoading(false)
			}
		}

		fetchBookings()
	}, [])

	const handleUpdateStatus = async (id, newStatus) => {
		try {
			await updateBookingStatus(id, newStatus)
			setBookings(prev =>
				prev.map(booking =>
					booking.id === id ? { ...booking, status: newStatus } : booking
				)
			)
		} catch (error) {
			throw new Error('Не вдалося оновити статус бронювання')
		}
	}

	const sortBookings = bookings => {
		return [...bookings].sort((a, b) => {
			const dateA = new Date(a.startTime)
			const dateB = new Date(b.startTime)

			switch (sortOption) {
				case 'date-asc':
					return dateA.getTime() - dateB.getTime()
				case 'date-desc':
					return dateB.getTime() - dateA.getTime()
				case 'status':
					return a.status.localeCompare(b.status)
				case 'time':
					return (
						dateA.getHours() * 60 +
						dateA.getMinutes() -
						(dateB.getHours() * 60 + dateB.getMinutes())
					)
				default:
					return 0
			}
		})
	}

	const isPastBooking = (date: string) => new Date(date) < new Date()

	return (
		<div className='container max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg'>
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-semibold'>Профіль користувача</h2>
			</div>

			<div className='flex justify-center mb-8'>
				<UserIcon
					size={100}
					className='text-gray-500 bg-gray-200 p-6 rounded-full'
				/>
			</div>

			<div className='space-y-6 mb-10'>
				<div className='flex justify-between'>
					<span className='font-semibold'>Ім’я:</span>
					<span>
						{user.firstName} {user.lastName}
					</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-semibold'>Email:</span>
					<span>{user.email}</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-semibold'>Номер телефону:</span>
					<span>{user.phoneNumber || 'Немає даних'}</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-semibold'>Роль:</span>
					<span>{user.role === 'admin' ? 'Адміністратор' : 'Користувач'}</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-semibold'>Дата реєстрації:</span>
					<span>{new Date(user.registrationDate).toLocaleDateString()}</span>
				</div>
			</div>

			<div>
				<h3 className='text-2xl font-semibold mb-4'>Мої бронювання</h3>
				<div className='mb-6'>
					<label className='block text-lg font-semibold text-gray-700 mb-2'>
						Сортувати за:
					</label>
					<DropDown
						options={sortOptions}
						placeholder='Оберіть критерій'
						width='250px'
						onChange={option => setSortOption(option.value)}
					/>
				</div>
				{loading ? (
					<p className='text-gray-500'>Завантаження...</p>
				) : bookings.length === 0 ? (
					<p className='text-gray-500'>Бронювань поки немає.</p>
				) : (
					<div className='space-y-4'>
						{sortBookings(bookings).map(booking => {
							const isPast = isPastBooking(booking.date)
							const statusColor = isPast
								? 'bg-gray-100 text-gray-600'
								: 'bg-green-100 text-green-700'

							const fieldName = booking.field?.name || 'Невідоме поле'

							return (
								<div
									key={booking.id}
									className={`p-4 border rounded-xl shadow-sm ${statusColor}`}
								>
									<div className='flex items-center gap-2 mb-2'>
										<MapPin className='text-blue-600' size={18} />
										<span className='font-medium'>Поле: {fieldName}</span>
									</div>
									<div className='flex items-center gap-2 mb-1'>
										<CalendarCheck size={18} />
										<span>
											Дата:{' '}
											{new Date(booking?.startTime).toLocaleString('uk-UA', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
											})}
										</span>
									</div>
									<div className='flex items-center gap-2 mb-1'>
										<Clock3 size={18} />
										<span>
											Час:{' '}
											{new Date(booking.startTime).toLocaleTimeString('uk-UA', {
												hour: '2-digit',
												minute: '2-digit',
												hour12: false,
												timeZone: 'Europe/Kyiv',
											})}{' '}
											–{' '}
											{new Date(booking.endTime).toLocaleTimeString('uk-UA', {
												hour: '2-digit',
												minute: '2-digit',
												hour12: false,
												timeZone: 'Europe/Kyiv',
											})}
										</span>
									</div>
									<div className='text-sm mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
										<div>
											Статус:{' '}
											<span
												className={`font-semibold ${
													isPast
														? 'text-gray-600'
														: booking.status === 'confirmed'
														? 'text-blue-700'
														: booking.status === 'cancelled'
														? 'text-red-600'
														: 'text-yellow-600'
												}`}
											>
												{isPast
													? 'Завершено'
													: booking.status === 'confirmed'
													? 'Підтверджено'
													: booking.status === 'cancelled'
													? 'Скасовано'
													: 'Очікує підтвердження'}
											</span>
										</div>

										{!isPast && booking.status === 'pending' && (
											<div className='flex gap-2'>
												<button
													className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
													onClick={() =>
														handleUpdateStatus(booking.id, 'confirmed')
													}
												>
													Підтвердити
												</button>
												<button
													className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
													onClick={() =>
														handleUpdateStatus(booking.id, 'cancelled')
													}
												>
													Скасувати
												</button>
											</div>
										)}
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			<div className='text-center mt-10'>
				<button
					className='px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300'
					onClick={logout}
				>
					Вийти
				</button>
			</div>
		</div>
	)
}

export default Profile
