import axios from 'axios'
import {
	createBooking,
	getUserBookings,
	updateBookingStatus,
} from '../../services/bookingService'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})

describe('Booking Service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('createBooking', () => {
		const bookingData = {
			startTime: new Date('2024-01-01T10:00:00'),
			endTime: new Date('2024-01-01T12:00:00'),
			fieldId: 1,
		}

		it('should create booking successfully with valid token', async () => {
			const mockResponse = {
				data: { id: 1, ...bookingData, status: 'pending' },
			}
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.post.mockResolvedValueOnce(mockResponse)

			const result = await createBooking(bookingData)

			expect(mockedAxios.post).toHaveBeenCalledWith(
				'http://localhost:5000/bookings',
				bookingData,
				{
					headers: {
						Authorization: 'Bearer valid-token',
					},
				}
			)
			expect(result).toEqual(mockResponse.data)
		})

		it('should throw error when no token found', async () => {
			localStorageMock.getItem.mockReturnValue(null)

			await expect(createBooking(bookingData)).rejects.toThrow('No token found')
			expect(mockedAxios.post).not.toHaveBeenCalled()
		})

		it('should handle axios error', async () => {
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

			await expect(createBooking(bookingData)).rejects.toThrow('Network error')
		})
	})

	describe('getUserBookings', () => {
		it('should get user bookings successfully', async () => {
			const mockBookings = [
				{ id: 1, startTime: '2024-01-01T10:00:00', status: 'confirmed' },
				{ id: 2, startTime: '2024-01-02T14:00:00', status: 'pending' },
			]
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.get.mockResolvedValueOnce({ data: mockBookings })

			const result = await getUserBookings()

			expect(mockedAxios.get).toHaveBeenCalledWith(
				'http://localhost:5000/bookings',
				{
					headers: { Authorization: 'Bearer valid-token' },
				}
			)
			expect(result).toEqual(mockBookings)
		})

		it('should throw error when no token', async () => {
			localStorageMock.getItem.mockReturnValue(null)

			await expect(getUserBookings()).rejects.toThrow('No token')
			expect(mockedAxios.get).not.toHaveBeenCalled()
		})
	})

	describe('updateBookingStatus', () => {
		it('should update booking status successfully', async () => {
			const bookingId = '123'
			const newStatus = 'confirmed'
			const mockResponse = { data: { id: bookingId, status: newStatus } }

			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.patch.mockResolvedValueOnce(mockResponse)

			const result = await updateBookingStatus(bookingId, newStatus)

			expect(mockedAxios.patch).toHaveBeenCalledWith(
				`http://localhost:5000/bookings/${bookingId}`,
				{ status: newStatus },
				{
					headers: {
						Authorization: 'Bearer valid-token',
					},
				}
			)
			expect(result).toEqual(mockResponse.data)
		})

		it('should handle all valid status values', async () => {
			const bookingId = '123'
			const statuses: ('pending' | 'confirmed' | 'cancelled')[] = [
				'pending',
				'confirmed',
				'cancelled',
			]

			localStorageMock.getItem.mockReturnValue('valid-token')

			for (const status of statuses) {
				mockedAxios.patch.mockResolvedValueOnce({
					data: { id: bookingId, status },
				})

				const result = await updateBookingStatus(bookingId, status)

				expect(result).toEqual({ id: bookingId, status })
			}
		})

		it('should throw error when no token', async () => {
			localStorageMock.getItem.mockReturnValue(null)

			await expect(updateBookingStatus('123', 'confirmed')).rejects.toThrow(
				'No token'
			)
			expect(mockedAxios.patch).not.toHaveBeenCalled()
		})
	})
})
