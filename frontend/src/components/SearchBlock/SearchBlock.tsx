import { setHours } from 'date-fns/setHours'
import { setMinutes } from 'date-fns/setMinutes'
import { Search } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'
import { Typewriter } from 'react-simple-typewriter'
import { ReactSVG } from 'react-svg'
import promoLogo from '../../assets/promo-logo.svg'
import { optionsCities } from '../../utils/constants'

const SearchBlock = () => {
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [time, setTime] = useState<Date | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const navigate = useNavigate()

	return (
		<div className='container px-4 mx-auto h-[400px] flex items-center justify-between'>
			<div className='flex flex-col'>
				<h1 className='text-white text-4xl font-bold'>
					Бронюйте в містi{' '}
					<span className='text-[#e5fc3a] font-semibold'>
						<Typewriter
							words={optionsCities.map(option => option.label)}
							loop={true}
							cursor
							cursorStyle='|'
							typeSpeed={70}
							deleteSpeed={50}
							delaySpeed={2000}
						/>
					</span>{' '}
					онлайн
				</h1>

				<div className='flex items-center justify-between mt-16 w-[800px] flex-col gap-4'>
					<div className='flex items-center gap-4 w-full'>
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
					</div>

					<div className='flex items-start gap-4 w-full'>
						<div className='relative w-64'>
							<DatePicker
								selected={startDate}
								onChange={date => setStartDate(date)}
								className='bg-white rounded-xl shadow-lg text-[#162328] px-4 py-3 w-full focus:outline-none'
								dateFormat='dd/MM/yyyy'
								minDate={new Date()}
								placeholderText='Виберіть дату'
							/>
						</div>
						<div className='relative w-64'>
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
						<button
							className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-4 py-3 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300 w-64'
							onClick={() => {
								if (startDate) {
									sessionStorage.setItem('bookingDate', startDate.toISOString())
								}
								if (time) {
									sessionStorage.setItem('bookingTime', time.toISOString())
								}
								navigate(`/fields?search=${encodeURIComponent(searchQuery)}`)
							}}
						>
							Пошук
						</button>
					</div>
				</div>
			</div>
			<ReactSVG src={promoLogo} />
		</div>
	)
}

export default SearchBlock
