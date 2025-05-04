import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await login(email, password)
			navigate('/')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred')
		}
	}

	return (
		<div className='flex justify-center'>
			<div className='mx-auto mt-8'>
				<h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
				<form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-sm'>
					<input
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder='Email'
						className='border p-2 rounded'
					/>
					<input
						type='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder='Password'
						className='border p-2 rounded'
					/>
					{error && <p className='text-red-500'>{error}</p>}
					<Link
						to='/register'
						className='text-center hover:underline text-blue-600'
					>
						Don't have an account? Register
					</Link>
					<button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
						Login
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login
