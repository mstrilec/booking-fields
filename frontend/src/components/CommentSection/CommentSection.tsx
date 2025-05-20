import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { Trash2, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { createComment, deleteComment } from '../../services/commentService'

interface CommentUser {
	id: number
	firstName: string
	lastName: string
	email: string
}

interface Comment {
	id: number
	text: string
	createdAt: string
	user: CommentUser
}

interface GoogleReview {
	author_name: string
	rating: number
	text: string
	time: number
}

interface CommentSectionProps {
	placeId: string | undefined
	googleReviews?: GoogleReview[]
	comments?: Comment[]
	onCommentAdded: () => void
}

const CommentSection: React.FC<CommentSectionProps> = ({
	placeId,
	googleReviews = [],
	comments = [],
	onCommentAdded,
}) => {
	const { user } = useAuth()
	const [commentText, setCommentText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!commentText.trim()) {
			toast.error('Коментар не може бути порожнім')
			return
		}

		if (!user) {
			toast.error('Будь ласка, авторизуйтесь щоб залишити коментар')
			return
		}

		try {
			setIsSubmitting(true)
			await createComment({
				text: commentText,
				placeId,
			})
			setCommentText('')
			toast.success('Коментар додано успішно')
			onCommentAdded()
		} catch (error) {
			toast.error('Не вдалося додати коментар')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async (commentId: number) => {
		if (!window.confirm('Ви впевнені, що хочете видалити цей коментар?')) {
			return
		}

		try {
			await deleteComment(commentId)
			toast.success('Коментар видалено')
			onCommentAdded()
		} catch (error) {
			toast.error('Не вдалося видалити коментар')
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return format(date, 'dd MMMM yyyy о HH:mm', { locale: uk })
	}

	const allFeedback = [
		...googleReviews.map(review => ({
			type: 'google',
			author: review.author_name,
			text: review.text,
			time: review.time * 1000,
		})),
		...comments.map(comment => ({
			type: 'user',
			id: comment.id,
			author: `${comment.user.firstName} ${comment.user.lastName}`,
			text: comment.text,
			time: new Date(comment.createdAt).getTime(),
			userId: comment.user.id,
		})),
	].sort((a, b) => b.time - a.time)

	return (
		<div className='mt-6'>
			<h2 className='text-2xl font-semibold mb-4'>Відгуки та коментарі</h2>
			{!user && (
				<div className='mt-4 mb-4 p-3 bg-blue-50 rounded-lg text-blue-700'>
					<p>Увійдіть, щоб залишити свій коментар.</p>
				</div>
			)}

			{user && (
				<form onSubmit={handleSubmit} className='mb-6'>
					<div className='flex flex-col space-y-2'>
						<textarea
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Залиште свій коментар...'
							rows={4}
							value={commentText}
							onChange={e => setCommentText(e.target.value)}
						/>
						<button
							type='submit'
							disabled={isSubmitting}
							className='self-end bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 cursor-pointer'
						>
							{isSubmitting ? 'Додаємо...' : 'Додати коментар'}
						</button>
					</div>
				</form>
			)}

			{allFeedback.length > 0 ? (
				<ul className='space-y-4'>
					{allFeedback.map((item, index) => (
						<li
							key={`${item.type}-${index}`}
							className='flex items-start gap-4 p-4 bg-gray-100 rounded-xl shadow-sm'
						>
							<div className='flex-shrink-0'>
								<div
									className={`text-white p-2 rounded-full ${
										item.type === 'google' ? 'bg-red-500' : 'bg-blue-500'
									}`}
								>
									<UserIcon size={24} />
								</div>
							</div>
							<div className='flex-grow'>
								<div className='flex justify-between items-center'>
									<p className='font-semibold text-gray-800'>{item.author}</p>
									<span className='text-sm text-gray-500'>
										{item.type === 'google'
											? format(new Date(item.time), 'dd MMM yyyy', {
													locale: uk,
											  })
											: formatDate(new Date(item.time).toISOString())}
										{item.type === 'google' && ' (Google)'}
									</span>
								</div>
								<p className='text-gray-600 mt-1'>{item.text}</p>
							</div>

							{item.type === 'user' &&
								(user?.id === item.userId || user?.role === 'admin') && (
									<button
										onClick={() => handleDelete(item.id)}
										className='text-red-500 hover:text-red-700 transition-colors'
										title='Видалити коментар'
									>
										<Trash2 size={18} />
									</button>
								)}
						</li>
					))}
				</ul>
			) : (
				<p className='text-gray-500'>Відгуків та коментарів немає.</p>
			)}
		</div>
	)
}

export default CommentSection
