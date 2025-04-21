export const API_URL = 'http://localhost:5000'

export const loginService = async (email: string, password: string) => {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	})
	if (!res.ok) {
		const data = await res.json()
		throw new Error(data.message || 'Login failed')
	}
	return res.json()
}

export const registerService = async (form: {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber?: string
}) => {
	const res = await fetch(`${API_URL}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(form),
	})
	if (!res.ok) {
		const data = await res.json()
		throw new Error(data.message || 'Register failed')
	}
	return res.json()
}

export const getMe = async () => {
	const res = await fetch(`${API_URL}/auth/me`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
	if (!res.ok) {
		throw new Error('Unauthorized')
	}
	return res.json()
}
