import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		phoneNumber: '',
	})

	const { register } = useAuth()
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			await register(form)
			navigate('/')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred')
		}
	}

	return (
		<div className='flex justify-center'>
			<div className='w-full max-w-sm p-6 mt-8'>
				<h2 className='text-2xl font-bold mb-4 text-center'>Register</h2>
				<form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-sm'>
					<input
						name='firstName'
						value={form.firstName}
						onChange={handleChange}
						placeholder='First Name'
						className='border p-2 rounded'
						required
					/>
					<input
						name='lastName'
						value={form.lastName}
						onChange={handleChange}
						placeholder='Last Name'
						className='border p-2 rounded'
						required
					/>
					<input
						type='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						placeholder='Email'
						className='border p-2 rounded'
						required
					/>
					<input
						type='password'
						name='password'
						value={form.password}
						onChange={handleChange}
						placeholder='Password (min. 6 characters)'
						className='border p-2 rounded'
						required
					/>
					<input
						name='phoneNumber'
						value={form.phoneNumber}
						onChange={handleChange}
						placeholder='Phone Number (optional)'
						className='border p-2 rounded'
					/>
					{error && <p className='text-red-500'>{error}</p>}
					<a
						href='/login'
						className='text-center hover:underline text-blue-600'
					>
						Already have an account? Log in
					</a>
					<button className='bg-[#25b68f] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#1e9e7b] transition cursor-pointer'>
						Register
					</button>
				</form>
			</div>
		</div>
	)
}

export default Register
