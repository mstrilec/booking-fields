import { ReactNode } from 'react'

interface FeatureCardProps {
	title: string
	text?: string
	icon?: ReactNode
	bg?: string
}

export const FeatureCard = ({ title, text, icon, bg }: FeatureCardProps) => {
	const backgroundClass = bg ?? 'bg-[#3d4ef3]'
	const textColorClass = bg ? 'text-black' : 'text-white'

	return (
		<div
			className={`relative rounded-2xl p-6 min-h-[160px] ${backgroundClass} ${textColorClass}`}
		>
			<h3 className='font-bold text-lg'>{title}</h3>
			{text && <p className='text-sm mt-2'>{text}</p>}
			{icon}
		</div>
	)
}
