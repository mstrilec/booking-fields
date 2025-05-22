export interface Field {
	placeId: string
	name: string
	address: string
	phoneNumber?: string
	geometry: {
		location?: {
			lat: number
			lng: number
		}
	}
	website?: string
	reviews?: Array<{
		author_name: string
		rating: number
		text: string
		time: number
	}>
	photos?: Array<{
		height: number
		html_attributions: string[]
		photo_reference: string
		width: number
	}>
	price?: number
	additionalInfo?: string
	comments?: Array<Comment>
	icon: string
	vicinity: string
	rating?: number
	user_ratings_total?: number
	place_id: string
	business_status?: string
}

export interface Comment {
	id: number
	text: string
	createdAt: Date
	user: CommentUser
}

export interface CommentUser {
	id: number
	firstName: string
	lastName: string
	email: string
}

export interface AddressComponent {
	long_name: string
	short_name: string
	types: string[]
}

export interface SortOption {
	label: string
	value: string
}

export interface Booking {
	id: string
	field: Field
	startTime: string
	endTime: string
	date: string
	status: 'pending' | 'confirmed' | 'cancelled'
}

export interface User {
	firstName: string
	lastName: string
	email: string
	phoneNumber?: string
	role: string
	registrationDate: Date
}

export interface UpdatedField {
	placeId: string
	phoneNumber?: string
	price?: number
	additionalInfo?: string
}

export interface CommentData {
	text: string
	placeId: string
}

export interface CommentResponse {
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

export interface RegisterForm {
	firstName: string
	lastName: string
	email: string
	password: string
	phoneNumber?: string
}
