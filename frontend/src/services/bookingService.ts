import axios from 'axios'

interface CreateBookingDto {
	startTime: Date
	endTime: Date
	fieldId: number
	expectedPrice: number
}

const API_URL = 'http://localhost:5000'

export const createBooking = async (data: CreateBookingDto) => {
	const token = localStorage.getItem('token')

	if (!token) {
		throw new Error('No token found')
	}

	try {
		const response = await axios.post(`${API_URL}/bookings`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 409) {
				if (error.response.data.message === 'Time slot already booked') {
					throw new Error('Цей час вже заброньовано. Оберіть інший.')
				}
				if (error.response.data.message === 'PRICE_CHANGED') {
					throw new Error('Ціна змінилася. Оновіть сторінку і спробуйте знову.')
				}
			}
		}
		throw error
	}
}

export const getUserBookings = async () => {
	const token = localStorage.getItem('token')
	if (!token) throw new Error('No token')

	const response = await axios.get(`${API_URL}/bookings`, {
		headers: { Authorization: `Bearer ${token}` },
	})
	return response.data
}

export const updateBookingStatus = async (
	id: string,
	status: 'pending' | 'confirmed' | 'cancelled'
) => {
	const token = localStorage.getItem('token')
	if (!token) throw new Error('No token')

	const response = await axios.patch(
		`${API_URL}/bookings/${id}`,
		{ status },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	return response.data
}
