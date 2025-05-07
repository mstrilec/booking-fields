import axios from 'axios'

const API_URL = 'http://localhost:5000'

interface CommentData {
	text: string
	placeId: string
}

interface CommentResponse {
	id: number
	text: string
	createdAt: string
	user: {
		id: number
		firstName: string
		lastName: string
		email: string
	}
}

export const createComment = async (
	data: CommentData
): Promise<CommentResponse> => {
	const token = localStorage.getItem('token')
	if (!token) {
		throw new Error('No token found')
	}

	const response = await axios.post(`${API_URL}/comments`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return response.data
}

export const getCommentsByPlaceId = async (
	placeId: string
): Promise<CommentResponse[]> => {
	const response = await axios.get(`${API_URL}/comments/field/${placeId}`)
	return response.data
}

export const deleteComment = async (commentId: number): Promise<void> => {
	const token = localStorage.getItem('token')
	if (!token) {
		throw new Error('No token found')
	}

	await axios.delete(`${API_URL}/comments/${commentId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}
