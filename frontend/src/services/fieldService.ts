import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const getNearbyFields = async () => {
	try {
		const response = await axios.get(`${API_URL}/fields`)
		return response.data
	} catch (error) {
		console.error('Error fetching nearby fields:', error)
		throw error
	}
}

export const getFieldByPlaceId = async placeId => {
	try {
		const response = await axios.get(`${API_URL}/fields/${placeId}`)
		return response.data
	} catch (error) {
		console.error(`Error fetching field with ID ${placeId}:`, error)
		throw error
	}
}

export const createField = async placeId => {
	try {
		const response = await axios.post(`${API_URL}/fields/create`, { placeId })
		return response.data
	} catch (error) {
		console.error(`Error creating field with placeId ${placeId}:`, error)
		throw error
	}
}

export const updateField = async (placeId, updateData, token) => {
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
		console.error(`Error updating field with ID ${placeId}:`, error)
		throw error
	}
}

export const syncNearbyFields = async token => {
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
	} catch (error) {
		console.error('Error syncing nearby fields:', error)
		throw error
	}
}
