import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'
import DropDownMenu from '../DropDownMenu/DropDownMenu'

const Header = () => {
	const { isLoggedIn, user } = useAuth()
	const [openProfile, setOpenProfile] = useState(false)
	const navigate = useNavigate()

	return (
		<header className='bg-[#2156a1] h-[70px]'>
			<div className='container mx-auto flex justify-between items-center h-full px-4 text-white'>
				<a href='/'>
					<img src={logo} alt='Sportbook' className='w-38 h-auto' />
				</a>
				<nav>
					<ul className='flex gap-15 text-white'>
						<li>
							<a
								href='/fields'
								className='relative inline-block pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
							>
								Fields
							</a>
						</li>
						<li>
							<a
								href='/about'
								className='relative inline-block pb-1 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
							>
								About us
							</a>
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
							<h1>{user?.firstName}</h1>
						</div>
						{openProfile && <DropDownMenu />}
					</div>
				) : (
					<button
						className='bg-[#25b68f] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#1e9e7b] transition cursor-pointer'
						onClick={() => navigate('/register')}
					>
						Register
					</button>
				)}
			</div>
		</header>
	)
}

export default Header
