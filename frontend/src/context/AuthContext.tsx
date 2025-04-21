import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { getMe, loginService, registerService } from '../services/authService'

interface User {
	id: number
	email: string
	firstName: string
	lastName: string
	role: 'user' | 'admin'
	phoneNumber: string
	registrationDate: Date
}

interface AuthContextType {
	isLoggedIn: boolean
	user: User | null
	login: (email: string, password: string) => Promise<void>
	register: (data: RegisterData) => Promise<void>
	logout: () => void
}

interface RegisterData {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber?: string
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			setIsLoggedIn(true)
			getMe()
				.then(user => setUser(user))
				.catch(() => {
					setIsLoggedIn(false)
					setUser(null)
					localStorage.removeItem('token')
				})
		}
	}, [])

	const login = async (email: string, password: string) => {
		const { accessToken, user } = await loginService(email, password)
		localStorage.setItem('token', accessToken)
		setUser(user)
		setIsLoggedIn(true)
	}

	const register = async (data: RegisterData) => {
		const { accessToken, user } = await registerService(data)
		localStorage.setItem('token', accessToken)
		setUser(user)
		setIsLoggedIn(true)
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
		setIsLoggedIn(false)
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
