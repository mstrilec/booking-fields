import { Link } from 'react-router-dom'

const Footer = () => {
	return (
		<footer className='bg-[#1171f5] text-white py-8 mt-16'>
			<div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
				<div>
					<h2 className='text-xl font-semibold mb-2'>Sportbook</h2>
					<p className='text-sm text-[#e0e0e0]'>
						Платформа для зручного пошуку та бронювання спортивних майданчиків
						по всій Україні.
					</p>
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-2'>Навігація</h3>
					<ul className='space-y-1 text-sm'>
						<li>
							<Link to='/fields' className='hover:underline'>
								Клуби
							</Link>
						</li>
						<li>
							<Link to='/about' className='hover:underline'>
								Про нас
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-2'>Контакти</h3>
					<ul className='text-sm'>
						<li>Email: support@sportbook.ua</li>
						<li>Телефон: +38 (050) 123-45-67</li>
						<li>
							Instagram:{' '}
							<Link to='#' className='underline'>
								@sportbook.ua
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<div className='mt-8 border-t border-white/20 pt-4 text-center text-sm text-[#e0e0e0]'>
				© {new Date().getFullYear()} Sportbook. Усі права захищені.
			</div>
		</footer>
	)
}

export default Footer
