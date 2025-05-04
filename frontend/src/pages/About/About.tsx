import { HeartHandshake, ShieldCheck, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
	return (
		<div className='container mx-auto px-4 py-16'>
			<h1 className='text-4xl font-bold text-center text-[#1171f5] mb-12'>
				Про нас
			</h1>

			<div className='max-w-3xl mx-auto text-center text-lg text-gray-700 mb-16'>
				<p>
					Sportbook — це онлайн-платформа для зручного пошуку, бронювання та
					керування спортивними майданчиками по всій Україні. Ми створили
					сервіс, який економить ваш час, допомагає знайти ідеальне місце для
					тренування та робить спорт доступнішим для кожного.
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-24'>
				<div className='flex gap-4 items-start'>
					<div className='bg-[#1171f5] p-4 rounded-xl text-white'>
						<Users size={32} />
					</div>
					<div>
						<h3 className='text-xl font-semibold mb-2'>Наша команда</h3>
						<p className='text-gray-600'>
							Ми — група ентузіастів спорту, технологій та сервісу. Об’єднані
							любов’ю до активного способу життя, ми створюємо зручний продукт
							для вас.
						</p>
					</div>
				</div>

				<div className='flex gap-4 items-start'>
					<div className='bg-[#1171f5] p-4 rounded-xl text-white'>
						<Target size={32} />
					</div>
					<div>
						<h3 className='text-xl font-semibold mb-2'>Наша мета</h3>
						<p className='text-gray-600'>
							Ми прагнемо зробити спорт доступним, а пошук майданчиків — таким
							же простим, як замовлення кави онлайн.
						</p>
					</div>
				</div>

				<div className='flex gap-4 items-start'>
					<div className='bg-[#1171f5] p-4 rounded-xl text-white'>
						<HeartHandshake size={32} />
					</div>
					<div>
						<h3 className='text-xl font-semibold mb-2'>Наші партнери</h3>
						<p className='text-gray-600'>
							Ми працюємо з найкращими спортивними клубами та аренами по всій
							країні, щоби ви могли обирати тільки перевірені локації.
						</p>
					</div>
				</div>

				<div className='flex gap-4 items-start'>
					<div className='bg-[#1171f5] p-4 rounded-xl text-white'>
						<ShieldCheck size={32} />
					</div>
					<div>
						<h3 className='text-xl font-semibold mb-2'>
							Безпека та надійність
						</h3>
						<p className='text-gray-600'>
							Ваша конфіденційність і захист даних — наш пріоритет. Ми
							використовуємо сучасні технології для забезпечення безпечного
							користування платформою.
						</p>
					</div>
				</div>
			</div>

			<div className='text-center text-gray-500'>
				<p>
					Маєте питання? Пишіть нам на{' '}
					<Link
						to='mailto:support@sportbook.ua'
						className='text-[#1171f5] underline'
					>
						support@sportbook.ua
					</Link>{' '}
					або в Instagram:{' '}
					<Link
						to='https://instagram.com/sportbook.ua'
						className='text-[#1171f5] underline'
					>
						@sportbook.ua
					</Link>
				</p>
			</div>
		</div>
	)
}

export default About
