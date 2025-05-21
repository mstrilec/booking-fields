import axios from 'axios'

interface CreateBookingDto {
	startTime: Date
	endTime: Date
	fieldId: number
}

const API_URL = 'http://localhost:5000'

export const createBooking = async (data: CreateBookingDto) => {
	const token = localStorage.getItem('token')

	if (!token) {
		throw new Error('No token found')
	}

	const response = await axios.post(`${API_URL}/bookings`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return response.data
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
