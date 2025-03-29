"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void
}

interface LocationSuggestion {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSearch = async () => {
    if (searchTerm.length < 3) return

    setIsLoading(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&addressdetails=1`,
      )
      const data = await response.json()
      setSuggestions(data)
      setOpen(true)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    onLocationSelect({
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
      name: suggestion.display_name.split(",").slice(0, 2).join(", "),
    })
    setOpen(false)
    setSearchTerm(suggestion.display_name.split(",").slice(0, 2).join(", "))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex-1 relative">
              <Input
                placeholder="Entrez votre ville ou code postal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
                className="w-full pr-10"
              />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground" />}
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem key={suggestion.place_id} onSelect={() => handleLocationSelect(suggestion)}>
                      {suggestion.display_name.split(",").slice(0, 3).join(", ")}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Entrez le nom de votre ville ou votre code postal pour trouver votre localisation
      </p>
    </div>
  )
}

