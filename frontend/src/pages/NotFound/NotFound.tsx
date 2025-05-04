import { Frown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
	const navigate = useNavigate()

	return (
		<div className='flex flex-col justify-center items-center min-h-screen text-[#1171f5]'>
			<div className='text-6xl'>
				<Frown />
			</div>
			<h1 className='text-4xl font-bold mt-4'>404</h1>
			<p className='text-xl text-gray-700 mb-8'>Сторінку не знайдено</p>
			<button
				className='bg-[#1171f5] text-white px-6 py-3 rounded-lg hover:bg-[#0a5bbd] transition duration-300'
				onClick={() => navigate('/')}
			>
				Повернутися на головну
			</button>
		</div>
	)
}

export default NotFound
