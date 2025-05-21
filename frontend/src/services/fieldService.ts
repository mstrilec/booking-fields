import axios from 'axios'
import { UpdatedField } from '../types/interfaces'

const API_URL = 'http://localhost:5000'

export const getNearbyFields = async (city?: string, pageToken?: string) => {
	try {
		const params: { city?: string; pageToken?: string } = {}

		if (city) params.city = city
		if (pageToken) params.pageToken = pageToken

		const response = await axios.get(`${API_URL}/fields`, { params })
		return response.data
	} catch {
		throw new Error('Не вдалося завантажити поля')
	}
}

export const getFieldByPlaceId = async (placeId: string) => {
	try {
		const response = await axios.get(`${API_URL}/fields/${placeId}`)
		return response.data
	} catch (error) {
		throw new Error(`Не вдалося завантажити поле з ID ${placeId}: ${error}`)
	}
}

export const createField = async (placeId: string) => {
	try {
		const response = await axios.post(`${API_URL}/fields/create`, { placeId })
		return response.data
	} catch (error) {
		throw new Error(`Не вдалося створити поле з ID ${placeId}: ${error}`)
	}
}

export const updateField = async (
	placeId: string,
	updateData: UpdatedField,
	token: string
) => {
	try {
		const response = await axios.patch(
			`${API_URL}/fields/${placeId}`,
			updateData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	} catch (error) {
		throw new Error(`Не вдалося оновити поле з ID ${placeId}: ${error}`)
	}
}

export const syncNearbyFields = async (token: string) => {
	try {
		const response = await axios.post(
			`${API_URL}/fields/sync`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	} catch {
		throw new Error('Не вдалося синхронізувати поля')
	}
}
