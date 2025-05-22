import axios from 'axios'
import {
	createField,
	getFieldByPlaceId,
	getNearbyFields,
	syncNearbyFields,
	updateField,
} from '../../services/fieldService'
import { UpdatedField } from '../../types/interfaces'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Field Service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('getNearbyFields', () => {
		it('should get nearby fields without parameters', async () => {
			const mockFields = [
				{ id: 1, name: 'Field 1', city: 'Kyiv' },
				{ id: 2, name: 'Field 2', city: 'Kyiv' },
			]
			mockedAxios.get.mockResolvedValueOnce({ data: mockFields })

			const result = await getNearbyFields()

			expect(mockedAxios.get).toHaveBeenCalledWith(
				'http://localhost:5000/fields',
				{ params: {} }
			)
			expect(result).toEqual(mockFields)
		})

		it('should get nearby fields with city parameter', async () => {
			const city = 'Lviv'
			const mockFields = [{ id: 3, name: 'Field 3', city: 'Lviv' }]
			mockedAxios.get.mockResolvedValueOnce({ data: mockFields })

			const result = await getNearbyFields(city)

			expect(mockedAxios.get).toHaveBeenCalledWith(
				'http://localhost:5000/fields',
				{
					params: { city },
				}
			)
			expect(result).toEqual(mockFields)
		})

		it('should get nearby fields with pagination token', async () => {
			const pageToken = 'next_page_token'
			const mockFields = [{ id: 4, name: 'Field 4' }]
			mockedAxios.get.mockResolvedValueOnce({ data: mockFields })

			const result = await getNearbyFields(undefined, pageToken)

			expect(mockedAxios.get).toHaveBeenCalledWith(
				'http://localhost:5000/fields',
				{
					params: { pageToken },
				}
			)
			expect(result).toEqual(mockFields)
		})

		it('should get nearby fields with both city and pageToken', async () => {
			const city = 'Odesa'
			const pageToken = 'token123'
			const mockFields = [{ id: 5, name: 'Field 5', city: 'Odesa' }]
			mockedAxios.get.mockResolvedValueOnce({ data: mockFields })

			const result = await getNearbyFields(city, pageToken)

			expect(mockedAxios.get).toHaveBeenCalledWith(
				'http://localhost:5000/fields',
				{
					params: { city, pageToken },
				}
			)
			expect(result).toEqual(mockFields)
		})

		it('should throw custom error when request fails', async () => {
			mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

			await expect(getNearbyFields()).rejects.toThrow(
				'Не вдалося завантажити поля'
			)
		})
	})

	describe('getFieldByPlaceId', () => {
		it('should get field by place ID successfully', async () => {
			const placeId = 'place123'
			const mockField = { id: 1, placeId, name: 'Test Field' }
			mockedAxios.get.mockResolvedValueOnce({ data: mockField })

			const result = await getFieldByPlaceId(placeId)

			expect(mockedAxios.get).toHaveBeenCalledWith(
				`http://localhost:5000/fields/${placeId}`
			)
			expect(result).toEqual(mockField)
		})

		it('should throw custom error when field not found', async () => {
			const placeId = 'nonexistent'
			const originalError = new Error('Not found')
			mockedAxios.get.mockRejectedValueOnce(originalError)

			await expect(getFieldByPlaceId(placeId)).rejects.toThrow(
				`Не вдалося завантажити поле з ID ${placeId}: ${originalError}`
			)
		})
	})

	describe('createField', () => {
		it('should create field successfully', async () => {
			const placeId = 'new_place_123'
			const mockCreatedField = { id: 1, placeId, name: 'New Field' }
			mockedAxios.post.mockResolvedValueOnce({ data: mockCreatedField })

			const result = await createField(placeId)

			expect(mockedAxios.post).toHaveBeenCalledWith(
				'http://localhost:5000/fields/create',
				{ placeId }
			)
			expect(result).toEqual(mockCreatedField)
		})

		it('should throw custom error when creation fails', async () => {
			const placeId = 'invalid_place'
			const originalError = new Error('Invalid place ID')
			mockedAxios.post.mockRejectedValueOnce(originalError)

			await expect(createField(placeId)).rejects.toThrow(
				`Не вдалося створити поле з ID ${placeId}: ${originalError}`
			)
		})
	})

	describe('updateField', () => {
		it('should update field successfully', async () => {
			const placeId = 'place123'
			const updateData: UpdatedField = {
				phoneNumber: '+380987654321',
				price: 150,
				additionalInfo: 'Open till 10PM',
				placeId,
			}
			const token = 'valid-token'
			const mockUpdatedField = { id: 1, ...updateData }

			mockedAxios.patch.mockResolvedValueOnce({ data: mockUpdatedField })

			const result = await updateField(placeId, updateData, token)

			expect(mockedAxios.patch).toHaveBeenCalledWith(
				`http://localhost:5000/fields/${placeId}`,
				updateData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			expect(result).toEqual(mockUpdatedField)
		})

		it('should throw custom error when update fails', async () => {
			const placeId = 'place123'
			const updateData: UpdatedField = {
				additionalInfo: 'Updated info',
				placeId,
			}
			const token = 'invalid-token'
			const originalError = new Error('Unauthorized')

			mockedAxios.patch.mockRejectedValueOnce(originalError)

			await expect(updateField(placeId, updateData, token)).rejects.toThrow(
				`Не вдалося оновити поле з ID ${placeId}: ${originalError}`
			)
		})
	})

	describe('syncNearbyFields', () => {
		it('should sync nearby fields successfully', async () => {
			const token = 'valid-token'
			const mockSyncResult = {
				synced: 5,
				message: 'Fields synced successfully',
			}

			mockedAxios.post.mockResolvedValueOnce({ data: mockSyncResult })

			const result = await syncNearbyFields(token)

			expect(mockedAxios.post).toHaveBeenCalledWith(
				'http://localhost:5000/fields/sync',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			expect(result).toEqual(mockSyncResult)
		})

		it('should throw custom error when sync fails', async () => {
			const token = 'invalid-token'
			mockedAxios.post.mockRejectedValueOnce(new Error('Sync failed'))

			await expect(syncNearbyFields(token)).rejects.toThrow(
				'Не вдалося синхронізувати поля'
			)
		})
	})
})
