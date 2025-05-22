import {
	getMe,
	loginService,
	registerService,
} from '../../services/authService'
import { RegisterForm } from '../../types/interfaces'

global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})

describe('Auth Service', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('loginService', () => {
		it('should login successfully with valid credentials', async () => {
			const mockResponse = {
				token: 'test-token',
				user: { id: 1, email: 'test@example.com' },
			}
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			} as unknown as Response)

			const result = await loginService('test@example.com', 'password123')

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:5000/auth/login',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: 'test@example.com',
						password: 'password123',
					}),
				}
			)
			expect(result).toEqual(mockResponse)
		})

		it('should throw error when login fails', async () => {
			const errorMessage = 'Invalid credentials'
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
			} as unknown as Response)

			await expect(
				loginService('test@example.com', 'wrong-password')
			).rejects.toThrow(errorMessage)
		})

		it('should throw default error when no error message provided', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: jest.fn().mockResolvedValueOnce({}),
			} as unknown as Response)

			await expect(
				loginService('test@example.com', 'wrong-password')
			).rejects.toThrow('Login failed')
		})
	})

	describe('registerService', () => {
		const validForm: RegisterForm = {
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			password: 'password123',
			phoneNumber: '+1234567890',
		}

		it('should register successfully with valid form data', async () => {
			const mockResponse = { message: 'User created successfully' }
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			} as unknown as Response)

			const result = await registerService(validForm)

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:5000/auth/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(validForm),
				}
			)
			expect(result).toEqual(mockResponse)
		})

		it('should register without optional phone number', async () => {
			const formWithoutPhone: RegisterForm = {
				firstName: validForm.firstName,
				lastName: validForm.lastName,
				email: validForm.email,
				password: validForm.password,
			}

			const mockResponse = { message: 'User created successfully' }
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(mockResponse),
			} as unknown as Response)

			await registerService(formWithoutPhone)

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:5000/auth/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formWithoutPhone),
				}
			)
		})

		it('should throw error when registration fails', async () => {
			const errorMessage = 'Email already exists'
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
			} as unknown as Response)

			await expect(registerService(validForm)).rejects.toThrow(errorMessage)
		})
	})

	describe('getMe', () => {
		it('should get user data successfully with valid token', async () => {
			const mockUser = { id: 1, email: 'test@example.com', firstName: 'John' }
			localStorageMock.getItem.mockReturnValue('valid-token')
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValueOnce(mockUser),
			} as unknown as Response)

			const result = await getMe()

			expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/auth/me', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer valid-token',
				},
			})
			expect(result).toEqual(mockUser)
		})

		it('should throw error when unauthorized', async () => {
			localStorageMock.getItem.mockReturnValue('invalid-token')
			mockFetch.mockResolvedValueOnce({
				ok: false,
			} as unknown as Response)

			await expect(getMe()).rejects.toThrow('Unauthorized')
		})

		it('should handle null token from localStorage', async () => {
			localStorageMock.getItem.mockReturnValue(null)
			mockFetch.mockResolvedValueOnce({
				ok: false,
			} as unknown as Response)

			await expect(getMe()).rejects.toThrow('Unauthorized')
			expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/auth/me', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer null',
				},
			})
		})
	})
})
