import { Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import DropDown from '../../components/DropDown/DropDown'
import FieldCard from '../../components/FieldCard/FieldCard'
import Map from '../../components/Map/Map'
import { getNearbyFields } from '../../services/fieldService'
import {
	optionsBusinessStatus,
	optionsCities,
	optionsPrice,
	optionsRating,
	optionsReviews,
} from '../../utils/constants'

const Fields = () => {
	const [fields, setFields] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [businessStatus, setBusinessStatus] = useState<string>('all')
	const [ratingSort, setRatingSort] = useState<string>('none')
	const [reviewsSort, setReviewsSort] = useState<string>('none')
	const [priceSort, setPriceSort] = useState<string>('none')
	const [filteredFields, setFilteredFields] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [city, setCity] = useState<string>('Київ')
	const [nextPageToken, setNextPageToken] = useState<string | null>(null)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [searchParams] = useSearchParams()

	const loadMoreFields = async () => {
		if (!nextPageToken) return
		try {
			setIsLoadingMore(true)
			toast.info('Завантаження додаткових полів...')

			const encodedToken = encodeURIComponent(nextPageToken)
			const moreFieldsData = await getNearbyFields(city, encodedToken)

			if (moreFieldsData.fields && moreFieldsData.fields.length > 0) {
				setFields(prev => [...prev, ...moreFieldsData.fields])
				setNextPageToken(moreFieldsData.nextPageToken || null)

				toast.success('Додаткові поля завантажено')
			} else {
				toast.info('Немає даних, спробувати пізніше')
				try {
					const initialFieldsData = await getNearbyFields(city)

					if (initialFieldsData.fields && initialFieldsData.fields.length > 0) {
						setFields(initialFieldsData.fields)
						setNextPageToken(initialFieldsData.nextPageToken || null)
					}
				} catch (error) {
					toast.error('Помилка при перезавантаженні полів')
				}
			}
		} catch (error) {
			toast.error('Не вдалося завантажити більше полів')
		} finally {
			setIsLoadingMore(false)
		}
	}

	useEffect(() => {
		const search = searchParams.get('search')
		if (search) {
			setSearchQuery(search)
		}
	}, [searchParams])

	useEffect(() => {
		const storedCity = sessionStorage.getItem('userCity')

		if (storedCity) {
			setCity(storedCity)
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(async position => {
					const { latitude, longitude } = position.coords
					try {
						const res = await fetch(
							`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
								import.meta.env.VITE_GOOGLE_API_KEY
							}&language=uk`
						)
						const data = await res.json()
						const cityComponent = data.results[0]?.address_components.find(c =>
							c.types.includes('locality')
						)
						const detectedCity = cityComponent?.long_name

						if (
							detectedCity &&
							optionsCities.find(option => option.value === detectedCity)
						) {
							sessionStorage.setItem('userCity', detectedCity)
							setCity(detectedCity)
						}
					} catch (error) {
						throw new Error('Не вдалося отримати дані про місто')
					}
				})
			}
		}
	}, [])

	useEffect(() => {
		const fetchFields = async () => {
			try {
				setLoading(true)
				const fieldsData = await getNearbyFields(city)
				setFields(fieldsData.fields)
				setNextPageToken(fieldsData.nextPageToken || null)
				setError(null)
			} catch (error) {
				setError('Не вдалося завантажити дані про клуби')
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

	if (loading)
		return <Loader2 className='animate-spin text-[#1171f5]' size={48} />
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
							width='19rem'
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
					<h2 className='text-3xl font-semibold'>Клуби в місті {city}</h2>
					<DropDown
						options={optionsCities}
						placeholder={city}
						width='20rem'
						onChange={option => {
							sessionStorage.setItem('userCity', option.value)
							setCity(option.value)
						}}
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
						<FieldCard field={field} index={index} />
					))}
				</div>
				{nextPageToken && (
					<div className='mt-6 flex justify-center'>
						{!isLoadingMore ? (
							<button
								className='bg-[#1171f5] text-white rounded-xl py-2 px-6 text-lg font-semibold hover:bg-[#0e5ed1] transition duration-300 cursor-pointer'
								onClick={loadMoreFields}
							>
								Завантажити більше
							</button>
						) : (
							<Loader2 className='animate-spin text-[#1171f5]' size={48} />
						)}
					</div>
				)}
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
