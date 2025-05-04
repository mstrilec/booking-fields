import { LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DropDownProfile.css'

const DropDownProfile = () => {
	const { logout } = useAuth()

	return (
		<div className='flex flex-col dropDownMenu'>
			<ul className='flex flex-col gap-2 text-black'>
				<Link to='/profile' className='flex items-center gap-1 hover:bg-green-400 p-1 rounded-lg transition-all duration-200 cursor-pointer'>
					<User size={18} /> <>Profile</>
				</Link>
				<li
					className='flex items-center gap-1 hover:bg-red-400 p-1 rounded-lg transition-all duration-200 cursor-pointer'
					onClick={logout}
				>
					<LogOut size={18} /> Log out
				</li>
			</ul>
		</div>
	)
}

export default DropDownProfile
