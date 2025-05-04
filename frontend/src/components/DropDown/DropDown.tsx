import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface DropDownOption {
	label: string
	value: number | string
}

interface DropDownProps {
	options: DropDownOption[]
	placeholder: string
	width?: string
	onChange: (option: DropDownOption) => void
}

const DropDown = ({ options, placeholder, width, onChange }: DropDownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState<string>(placeholder)

	const handleSelect = (option: DropDownOption) => {
		setSelected(option.label)
		onChange(option)
		setIsOpen(false)
	}

	return (
		<div className='relative' style={{ width }}>
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
					{options.map((option, i) => (
						<li
							key={i}
							className='px-4 py-2 hover:bg-blue-100 cursor-pointer'
							onClick={() => handleSelect(option)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default DropDown
