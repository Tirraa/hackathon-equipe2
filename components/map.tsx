"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
const icon = L.icon({
  iconUrl: "/ping.png",
  iconSize: [50, 66],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Default position (France)
const DEFAULT_POSITION = {
  lat: 46.603354,
  lng: 1.888334,
  zoom: 5,
}

interface MapProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void
}

function LocationMarker({ onLocationSelect }: MapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  const map = useMapEvents({
    click: async (e) => {
      setPosition(e.latlng)

      try {
        // Reverse geocoding to get location name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`,
        )
        const data = await response.json()

        // Check if display_name exists before trying to split it
        let locationName = "Localisation inconnue"
        if (data && data.display_name) {
          locationName = data.display_name.split(",").slice(0, 2).join(", ")
        } else if (data && data.address) {
          // Try to construct a name from address components if available
          const addressParts = []
          if (data.address.city) addressParts.push(data.address.city)
          else if (data.address.town) addressParts.push(data.address.town)
          else if (data.address.village) addressParts.push(data.address.village)

          if (data.address.state) addressParts.push(data.address.state)
          else if (data.address.county) addressParts.push(data.address.county)

          if (addressParts.length > 0) {
            locationName = addressParts.join(", ")
          }
        }

        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          name: locationName,
        })
      } catch (error) {
        console.error("Error fetching location name:", error)
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          name: "Localisation inconnue",
        })
      }
    },
  })

  return position === null ? null : <Marker position={position} icon={icon} />
}

export default function Map({ onLocationSelect }: MapProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[DEFAULT_POSITION.lat, DEFAULT_POSITION.lng]}
        zoom={DEFAULT_POSITION.zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
}

