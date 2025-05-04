interface ProsCardProps {
	icon: React.ReactNode
	title: string
	text: string
}

const ProsCard = ({ icon, title, text }: ProsCardProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-2 p-4 bg-[#f7f9fc] rounded-lg shadow-md'>
			<div>{icon}</div>
			<h3 className='text-lg font-semibold'>{title}</h3>
			<p className='text-sm text-gray-600 text-center'>{text}</p>
		</div>
	)
}

export default ProsCard
