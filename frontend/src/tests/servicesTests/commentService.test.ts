import axios from 'axios'
import {
	createComment,
	deleteComment,
	getCommentsByPlaceId,
} from '../../services/commentService'

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

describe('Comment Service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('createComment', () => {
		const commentData = {
			text: 'Great field!',
			placeId: 'place123',
		}

		it('should create comment successfully', async () => {
			const mockResponse = {
				data: {
					id: 1,
					text: 'Great field!',
					createdAt: '2024-01-01T10:00:00Z',
					user: {
						id: 1,
						firstName: 'John',
						lastName: 'Doe',
						email: 'john@example.com',
					},
				},
			}

			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.post.mockResolvedValueOnce(mockResponse)

			const result = await createComment(commentData)

			expect(mockedAxios.post).toHaveBeenCalledWith(
				'http://localhost:5000/comments',
				commentData,
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

			await expect(createComment(commentData)).rejects.toThrow('No token found')
			expect(mockedAxios.post).not.toHaveBeenCalled()
		})

		it('should handle axios error', async () => {
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.post.mockRejectedValueOnce(new Error('Server error'))

			await expect(createComment(commentData)).rejects.toThrow('Server error')
		})
	})

	describe('getCommentsByPlaceId', () => {
		it('should get comments by place ID successfully', async () => {
			const placeId = 'place123'
			const mockComments = [
				{
					id: 1,
					text: 'Great field!',
					createdAt: '2024-01-01T10:00:00Z',
					user: {
						id: 1,
						firstName: 'John',
						lastName: 'Doe',
						email: 'john@example.com',
					},
				},
				{
					id: 2,
					text: 'Nice place to play',
					createdAt: '2024-01-02T15:30:00Z',
					user: {
						id: 2,
						firstName: 'Jane',
						lastName: 'Smith',
						email: 'jane@example.com',
					},
				},
			]

			mockedAxios.get.mockResolvedValueOnce({ data: mockComments })

			const result = await getCommentsByPlaceId(placeId)

			expect(mockedAxios.get).toHaveBeenCalledWith(
				`http://localhost:5000/comments/field/${placeId}`
			)
			expect(result).toEqual(mockComments)
		})

		it('should handle empty comments array', async () => {
			const placeId = 'place456'
			mockedAxios.get.mockResolvedValueOnce({ data: [] })

			const result = await getCommentsByPlaceId(placeId)

			expect(result).toEqual([])
		})

		it('should handle axios error', async () => {
			const placeId = 'place123'
			mockedAxios.get.mockRejectedValueOnce(new Error('Not found'))

			await expect(getCommentsByPlaceId(placeId)).rejects.toThrow('Not found')
		})
	})

	describe('deleteComment', () => {
		it('should delete comment successfully', async () => {
			const commentId = 123
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.delete.mockResolvedValueOnce({})

			await deleteComment(commentId)

			expect(mockedAxios.delete).toHaveBeenCalledWith(
				`http://localhost:5000/comments/${commentId}`,
				{
					headers: {
						Authorization: 'Bearer valid-token',
					},
				}
			)
		})

		it('should throw error when no token found', async () => {
			const commentId = 123
			localStorageMock.getItem.mockReturnValue(null)

			await expect(deleteComment(commentId)).rejects.toThrow('No token found')
			expect(mockedAxios.delete).not.toHaveBeenCalled()
		})

		it('should handle axios error', async () => {
			const commentId = 123
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockedAxios.delete.mockRejectedValueOnce(new Error('Forbidden'))

			await expect(deleteComment(commentId)).rejects.toThrow('Forbidden')
		})
	})
})
