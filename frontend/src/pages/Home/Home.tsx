import { Clock, Dumbbell, Search, Star, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FeatureCard } from '../../components/FeatureCard/FeatureCard'
import FieldCard from '../../components/FieldCard/FieldCard'
import ProsCard from '../../components/ProsCard/ProsCard'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import { getNearbyFields } from '../../services/fieldService'
import { Field } from '../../types/interfaces'
import { featuresData } from '../../utils/featuresData'

const Home = () => {
	const [fields, setFields] = useState<Field[]>([])

	useEffect(() => {
		const fetchFields = async () => {
			try {
				const data = await getNearbyFields()
				const fields = data.fields
				fields.sort((a: Field, b: Field) => {
					const aRating = a.user_ratings_total ?? 0
					const bRating = b.user_ratings_total ?? 0
					return bRating - aRating
				})
				setFields(fields.slice(0, 4))
			} catch (error) {
				throw new Error('Не вдалося завантажити поля. Повідомлення: ' + error)
			}
		}
		fetchFields()
	}, [])

	return (
		<>
			<div className='bg-[#1171f5]'>
				<SearchBlock />
			</div>

			<div className='container mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<ProsCard
					icon={<Clock size={32} />}
					title="Ми на зв'язку 24/7"
					text='Допоможемо у будь-який час доби'
				/>
				<ProsCard
					icon={<Zap size={32} />}
					title='Бронь в кілька кліків'
					text='Резервуй майданчик швидко й без дзвінків'
				/>
				<ProsCard
					icon={<Search size={32} />}
					title='Зручний пошук'
					text='Фільтруй за видом спорту, часом і містом'
				/>
				<ProsCard
					icon={<Dumbbell size={32} />}
					title='Усі види спорту'
					text='Від футболу до настільного тенісу — обирай свій'
				/>
			</div>

			<div className='container mx-auto px-4 mt-20 bg-[#f7f9fc] py-8 rounded-2xl shadow-lg'>
				<h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
					<Star className='text-yellow-500' size={24} /> Популярні поля
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{fields.map((field, index) => (
						<FieldCard field={field} key={index} />
					))}
				</div>
			</div>

			<div className='container mx-auto px-4 mt-20'>
				<h2 className='text-2xl font-bold mb-6'>Все просто, переконайся сам</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{featuresData.map((item, idx) => (
						<FeatureCard key={idx} {...item} />
					))}
				</div>
			</div>
		</>
	)
}

export default Home
