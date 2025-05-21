import {
	GoogleMap,
	InfoWindow,
	Marker,
	useJsApiLoader,
} from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { Field } from '../../types/interfaces'

interface MapProps {
	fields: Field[]
}

const Map: React.FC<MapProps> = ({ fields }) => {
	const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

	if (!GOOGLE_API_KEY) {
		console.error(
			'Google Maps API key is missing. Please check your environment variables.'
		)
	}

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_API_KEY,
		libraries: ['places'],
	})

	const [selectedField, setSelectedField] = useState<Field | null>(null)
	const [mapCenter, setMapCenter] = useState({ lat: 50.4501, lng: 30.5234 })

	useEffect(() => {
		if (
			fields.length > 0 &&
			fields[0].geometry &&
			fields[0].geometry.location
		) {
			setMapCenter({
				lat: fields[0].geometry.location.lat,
				lng: fields[0].geometry.location.lng,
			})
		}
	}, [fields])

	if (loadError) {
		return (
			<div className='w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl'>
				<div className='text-center p-6'>
					<p className='text-red-500 font-semibold mb-2'>
						Помилка завантаження Google Maps
					</p>
					<p className='text-gray-600'>
						{loadError.message ||
							'Перевірте ваш API ключ та підключення до інтернету'}
					</p>
				</div>
			</div>
		)
	}

	if (!isLoaded) {
		return (
			<div className='w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl'>
				<div className='text-center'>
					<div className='spinner-border text-primary' role='status'>
						<span className='sr-only'>Завантаження карти...</span>
					</div>
					<p className='mt-2 text-gray-600'>Завантаження карти...</p>
				</div>
			</div>
		)
	}

	const hasValidFields =
		fields &&
		fields.length > 0 &&
		fields.some(field => field.geometry && field.geometry.location)

	return (
		<GoogleMap
			mapContainerClassName='w-full h-full rounded-2xl'
			center={mapCenter}
			zoom={12}
			options={{
				fullscreenControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				gestureHandling: 'cooperative',
			}}
		>
			{hasValidFields &&
				fields.map((field: Field, index: number) => {
					if (!field.geometry || !field.geometry.location) return null

					return (
						<Marker
							key={`${field.place_id || index}`}
							position={{
								lat: field.geometry.location.lat,
								lng: field.geometry.location.lng,
							}}
							onClick={() => setSelectedField(field)}
							animation={window.google?.maps?.Animation?.DROP}
						/>
					)
				})}

			{selectedField &&
				selectedField.geometry &&
				selectedField.geometry.location && (
					<InfoWindow
						position={{
							lat: selectedField.geometry.location.lat,
							lng: selectedField.geometry.location.lng,
						}}
						onCloseClick={() => setSelectedField(null)}
					>
						<div className='text-sm p-1'>
							<h3 className='font-semibold'>{selectedField.name}</h3>
							<p className='text-gray-600'>{selectedField.vicinity}</p>
							{selectedField.rating && (
								<div className='flex items-center mt-1'>
									<span className='text-yellow-400 mr-1'>★</span>
									<span>{selectedField.rating}</span>
									<span className='text-gray-400 text-xs ml-1'>
										({selectedField.user_ratings_total || 0})
									</span>
								</div>
							)}
						</div>
					</InfoWindow>
				)}
		</GoogleMap>
	)
}

export default Map
