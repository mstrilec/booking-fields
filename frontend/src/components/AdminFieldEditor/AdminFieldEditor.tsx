import { useState } from 'react'
import { toast } from 'react-toastify'
import { updateField } from '../../services/fieldService'
import { Field } from '../../types/interfaces'

interface AdminFieldEditorProps {
	field: Field | null
	setField: React.Dispatch<React.SetStateAction<Field | null>>
	placeId: string | undefined
}

const AdminFieldEditor: React.FC<AdminFieldEditorProps> = ({
	field,
	setField,
	placeId,
}) => {
	const [priceError, setPriceError] = useState('')

	const handleSave = async () => {
		if (priceError) {
			toast.error('Виправте помилки перед збереженням')
			return
		}

		if (!placeId) {
			toast.error('Не вказано ідентифікатор поля')
			return
		}

		try {
			const token = localStorage.getItem('token')
			if (!token) {
				toast.error('Не знайдено токен авторизації')
				return
			}
			await updateField(
				placeId,
				{
					placeId: placeId,
					phoneNumber: field?.phoneNumber,
					price: Number(field?.price),
					additionalInfo: field?.additionalInfo,
				},
				token
			)
			toast.success('Поле оновлено успішно')
		} catch {
			toast.error('Не вдалося оновити поле')
		}
	}

	return (
		<div className='mt-10'>
			<h2 className='text-2xl font-semibold mb-4'>
				Редагування поля (для адміністраторів)
			</h2>

			<input
				type='text'
				placeholder='Номер телефону...'
				className='w-full p-4 rounded-xl border border-gray-300 shadow-sm mb-4'
				value={field?.phoneNumber ?? ''}
				onChange={e => {
					if (!field) return

					setField({
						...field,
						phoneNumber: e.target.value,
					})
				}}
			/>

			<input
				type='text'
				placeholder='Ціна за годину...'
				className='w-full p-4 rounded-xl border border-gray-300 shadow-sm mb-2'
				value={field?.price != null ? field.price.toString() : ''}
				onChange={e => {
					if (!field) return

					const value = e.target.value

					if (value === '') {
						setPriceError('')
						setField({
							...field,
							price: 0,
						})
						return
					}

					if (!/^\d+$/.test(value)) {
						setPriceError('Ціна повинна бути числом')
					} else {
						setPriceError('')
						setField({
							...field,
							price: parseInt(value, 10),
						})
					}
				}}
			/>
			{priceError && <p className='text-red-500 text-sm mb-2'>{priceError}</p>}

			<textarea
				placeholder='Додаткова інформація про поле...'
				className='w-full p-4 rounded-xl border border-gray-300 shadow-sm'
				rows={4}
				value={field?.additionalInfo ?? ''}
				onChange={e => {
					if (!field) return

					setField({
						...field,
						additionalInfo: e.target.value,
					})
				}}
			/>

			<button
				className='mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer'
				onClick={handleSave}
				disabled={!!priceError}
			>
				Зберегти зміни
			</button>
		</div>
	)
}

export default AdminFieldEditor
