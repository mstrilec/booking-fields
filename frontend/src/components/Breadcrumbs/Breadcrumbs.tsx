import { Link, useLocation } from 'react-router-dom'

export const Breadcrumbs = () => {
	const location = useLocation()

	const pathnames = location.pathname.split('/').filter(x => x)

	return (
		<nav className='text-sm text-gray-600 my-4'>
			<ul className='flex items-center space-x-2'>
				<li>
					<Link to='/' className='hover:underline'>
						Головна
					</Link>
				</li>
				{pathnames.map((name, index) => {
					const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
					const isLast = index === pathnames.length - 1

					return (
						<li key={name} className='flex items-center space-x-2'>
							<span>/</span>
							{isLast ? (
								<span className='font-semibold'>
									{decodeURIComponent(name)}
								</span>
							) : (
								<Link to={routeTo} className='hover:underline'>
									{decodeURIComponent(name)}
								</Link>
							)}
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
