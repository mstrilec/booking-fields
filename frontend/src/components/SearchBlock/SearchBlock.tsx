import { setHours } from 'date-fns/setHours'
import { setMinutes } from 'date-fns/setMinutes'
import { Search } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Typewriter } from 'react-simple-typewriter'
import { ReactSVG } from 'react-svg'
import promoLogo from '../../assets/promo-logo.svg'
import DropDown from '../DropDown/DropDown'

const SearchBlock = () => {
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [time, setTime] = useState<Date | null>(null)
	const [duration, setDuration] = useState<number>(60)
	const [sport, setSport] = useState<number>(0)

	const optionsSport = [
		{ label: 'Всі види спорту', value: 0, cleanLabel: 'Всі види спорту' },
		{ label: '⚽ Футбол', value: 1, cleanLabel: 'Футбол' },
		{ label: '🏀 Баскетбол', value: 2, cleanLabel: 'Баскетбол' },
		{ label: '🎾 Теніс', value: 3, cleanLabel: 'Теніс' },
		{ label: '🏐 Волейбол', value: 4, cleanLabel: 'Волейбол' },
		{ label: '🏓 Настільний теніс', value: 5, cleanLabel: 'Настільний теніс' },
		{ label: '🏸 Бадмінтон', value: 6, cleanLabel: 'Бадмінтон' },
		{ label: '🏋️‍♂️ Фітнес', value: 7, cleanLabel: 'Фітнес' },
		{ label: '🏊‍♂️ Плавання', value: 8, cleanLabel: 'Плавання' },
		{ label: '🚴‍♂️ Велоспорт', value: 9, cleanLabel: 'Велоспорт' },
		{ label: '🏇 Коні', value: 10, cleanLabel: 'Коні' },
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

	console.log('sport: ', sport)
	console.log('duration: ', duration)

	return (
		<div className='container px-4 mx-auto h-[400px] flex items-center justify-between'>
			<div className='flex flex-col'>
				<h1 className='text-white text-4xl font-bold'>
					Бронюйте{' '}
					<span className='text-[#e5fc3a] font-semibold'>
						<Typewriter
							words={optionsSport.map(option => option.cleanLabel)}
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
						<DropDown
							options={optionsSport}
							placeholder='Всі види спорту'
							width='16rem'
							onChange={option => setSport(option.value)}
						/>
						<div className='relative w-full'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
							<input
								type='search'
								placeholder='Введіть назву клубу'
								className='bg-white rounded-xl shadow-lg max-h-60 overflow-auto text-[#162328] px-4 py-3 focus:outline-none pl-10 w-full'
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
						<DropDown
							options={optionsTime}
							placeholder='На 1 годину'
							width='16rem'
							onChange={option => setDuration(option.value)}
						/>
						<button
							className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-4 py-3 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300 w-64'
							onClick={() => console.log('Search')}
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
