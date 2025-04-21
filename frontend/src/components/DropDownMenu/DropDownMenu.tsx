import { LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './DropDownMenu.css'

const DropDownMenu = () => {
	const { logout } = useAuth()

	return (
		<div className='flex flex-col dropDownMenu'>
			<ul className='flex flex-col gap-2 text-black'>
				<li className='flex items-center gap-1 hover:bg-green-400 p-1 rounded-lg transition-all duration-200 cursor-pointer'>
					<User size={18} /> <a href=''>Profile</a>
				</li>
				<li
					className='flex items-center gap-1 hover:bg-red-400 p-1 rounded-lg transition-all duration-200 cursor-pointer'
					onClick={logout}
				>
					<LogOut size={18} /> <a href=''>Log out</a>
				</li>
			</ul>
		</div>
	)
}

export default DropDownMenu
