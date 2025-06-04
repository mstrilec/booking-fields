import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const getPhotoUrl = (
	photoReference: string,
	maxwidth: string = '400'
): string => {
	return `${API_URL}/google/photo/${photoReference}?maxwidth=${maxwidth}`
}

export const getGeocode = async (lat: number, lng: number) => {
	try {
		const res = await axios.get(`${API_URL}/google/geocode`, {
			params: { lat, lng },
		})
		return res.data
	} catch (error) {
		console.error('Failed to fetch geocode data:', error)
		throw new Error('Failed to fetch geocode data')
	}
}
