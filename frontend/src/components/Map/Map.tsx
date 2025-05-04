import {
	GoogleMap,
	InfoWindow,
	Marker,
	useJsApiLoader,
} from '@react-google-maps/api'
import { useState } from 'react'

const Map = ({ fields }: { fields: any[] }) => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: '',
	})

	const [selectedField, setSelectedField] = useState<any>(null)

	if (!isLoaded) return <div>Завантаження карти...</div>

	return (
		<GoogleMap
			mapContainerClassName='w-full h-full rounded-2xl'
			center={{ lat: 50.4501, lng: 30.5234 }}
			zoom={12}
		>
			{fields.map((field, index) => (
				<Marker
					key={index}
					position={{
						lat: field.geometry.location.lat,
						lng: field.geometry.location.lng,
					}}
					onClick={() => setSelectedField(field)}
				/>
			))}

			{selectedField && (
				<InfoWindow
					position={{
						lat: selectedField.geometry.location.lat,
						lng: selectedField.geometry.location.lng,
					}}
					onCloseClick={() => setSelectedField(null)}
				>
					<div className='text-sm'>
						<h3 className='font-semibold'>{selectedField.name}</h3>
						<p className='text-gray-600'>{selectedField.vicinity}</p>
					</div>
				</InfoWindow>
			)}
		</GoogleMap>
	)
}

export default Map
