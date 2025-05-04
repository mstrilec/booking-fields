import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'
import DropDownProfile from '../DropDownMenu/DropDownProfile'

const Header = () => {
	const { isLoggedIn, user } = useAuth()
	const [openProfile, setOpenProfile] = useState(false)
	const navigate = useNavigate()

	return (
		<header className='bg-[#1171f5] h-[70px]'>
			<div className='container mx-auto flex justify-between items-center h-full px-4 text-[#f7f9fc]'>
				<Link to='/' className='rounded-lg p-2'>
					<img src={logo} alt='Sportbook' className='w-38 h-auto' />
				</Link>
				<nav className='mr-15'>
					<ul className='flex gap-15 text-[#] font-semibold'>
						<li>
							<Link
								to='/fields'
								className='relative inline-block pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
							>
								Клуби
							</Link>
						</li>
						<li>
							<Link
								to='/about'
								className='relative inline-block pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
							>
								Про нас
							</Link>
						</li>
					</ul>
				</nav>
				{isLoggedIn ? (
					<div className='relative'>
						<div
							className='flex items-center justify-center gap-1 cursor-pointer hover:underline'
							onClick={() => setOpenProfile(!openProfile)}
						>
							{openProfile ? <ChevronUp /> : <ChevronDown />}
							<h2 className='text-lg font-semibold'>
								{user?.firstName} {user?.lastName}
							</h2>
						</div>
						{openProfile && <DropDownProfile />}
					</div>
				) : (
					<button
						className='bg-[#e5fc3a] text-[#1171f5] font-semibold px-5 py-2 rounded-lg hover:bg-[#bfd800] cursor-pointer transition duration-300'
						onClick={() => navigate('/login')}
					>
						Увійти
					</button>
				)}
			</div>
		</header>
	)
}

export default Header
