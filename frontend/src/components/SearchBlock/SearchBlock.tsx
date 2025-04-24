import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

const SearchBlock = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState('Всі види спорту')

	const options = [
		'⚽ Футбол',
		'🏀 Баскетбол',
		'🎾 Теніс',
		'💪 CrossFit',
		'🔥 EMS',
		'🏃‍♂️ HIIT',
		'🧘 Hot йога',
	]

	return (
		<div className='bg-[#1171f5] h-[400px] flex items-center justify-center flex-col bg-center'>
			<h1 className='text-white text-4xl font-bold'>Пошук поля</h1>

			<div className='flex items-center justify-between mt-16 w-[800px] flex-col gap-4'>
				<div className='flex items-center gap-4 w-full'>
					<div className='relative w-64'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='w-full px-4 py-3 pr-10 rounded-xl text-[#162328] bg-white border border-gray-300 shadow-md text-left'
						>
							{selected}
							<span
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ${
									isOpen ? 'rotate-180' : 'rotate-0'
								}`}
							>
								<ChevronDown size={20} color='#162328' />
							</span>
						</button>

						{isOpen && (
							<ul className='absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto'>
								<li
									className='px-4 py-2 hover:bg-blue-100 cursor-pointer'
									onClick={() => {
										setSelected('Всі види спорту')
										setIsOpen(false)
									}}
								>
									Всі види спорту
								</li>
								{options.map((option, i) => (
									<li
										key={i}
										className='px-4 py-2 hover:bg-blue-100 cursor-pointer'
										onClick={() => {
											setSelected(option)
											setIsOpen(false)
										}}
									>
										{option}
									</li>
								))}
							</ul>
						)}
					</div>
					<div className='relative w-full'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
						<input
							type='search'
							placeholder='Введіть назву клубу'
							className='bg-white rounded-xl shadow-lg max-h-60 overflow-auto text-[#162328] px-4 py-3 focus:outline-none pl-10 w-full'
						/>
					</div>
				</div>

				<div className='flex items-center gap-4'></div>
			</div>
		</div>
	)
}

export default SearchBlock
