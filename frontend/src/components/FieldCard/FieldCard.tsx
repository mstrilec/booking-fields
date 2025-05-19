import { useNavigate } from 'react-router-dom'

const FieldCard = ({ field, index }) => {
	const navigate = useNavigate()

	return (
		<div
			key={index}
			className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer flex flex-col justify-between'
		>
			{field.photos && field.photos.length > 0 ? (
				<img
					src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
						field.photos[0].photo_reference
					}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`}
					alt={field.name}
					className='w-full h-48 object-cover'
					referrerPolicy='no-referrer'
					onError={e => {
						e.currentTarget.src = '/fallback-image.jpg'
					}}
				/>
			) : (
				<div className='w-full h-48 flex items-center justify-center bg-gray-100'>
					<img src={field.icon} alt={field.name} className='w-16 h-16' />
				</div>
			)}

			<div className='p-4 flex flex-col flex-grow'>
				<h3 className='text-xl font-semibold text-[#162328] mb-1'>
					{field.name}
				</h3>
				<p className='text-gray-500 text-sm mb-2'>{field.vicinity}</p>

				<div className='flex items-center gap-2 mb-4'>
					<span className='text-yellow-400 text-lg'>★</span>
					<span className='text-gray-700'>
						{field.rating ?? 'Немає оцінки'}
					</span>
					<span className='text-gray-400 text-sm'>
						({field.user_ratings_total ?? 0})
					</span>
				</div>

				<button
					className='mt-auto bg-[#1171f5] text-white rounded-xl py-2 px-4 text-center font-semibold hover:bg-[#0e5ed1] transition duration-300 cursor-pointer'
					onClick={() => navigate(`/field/${field.place_id}`)}
				>
					Забронювати
				</button>
			</div>
		</div>
	)
}

export default FieldCard
