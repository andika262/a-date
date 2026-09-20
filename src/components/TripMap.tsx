import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowUpRight, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";

export type TripLocation = {
  order: number;
  name: string;
  moment: string;
  note: string;
  lat: number;
  lng: number;
  query?: string;
  secret?: boolean;
};

type TripMapProps = {
  locations: TripLocation[];
  routeUrl: string;
};

export default function TripMap({ locations, routeUrl }: TripMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const [activeLocation, setActiveLocation] = useState(0);

  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return;

    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds(locations.map((location) => [location.lat, location.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [42, 42] });

    L.polyline(
      locations.map((location) => [location.lat, location.lng] as [number, number]),
      { color: "var(--primary)", weight: 3, opacity: 0.7, dashArray: "7 10" },
    ).addTo(map);

    markers.current = locations.map((location, index) => {
      const icon = L.divIcon({
        className: "trip-marker-shell",
        html: `<span class="trip-marker">${location.order}</span>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
      const popupName = location.secret ? "Secret Place" : location.name;
      const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${popupName}</strong><br/><span>${location.moment}</span>`);
      marker.on("click", () => setActiveLocation(index));
      return marker;
    });

    mapInstance.current = map;
    window.setTimeout(() => map.invalidateSize(), 80);

    return () => {
      map.remove();
      mapInstance.current = null;
      markers.current = [];
    };
  }, [locations]);

  const chooseLocation = (index: number) => {
    const location = locations[index];
    const map = mapInstance.current;
    const marker = markers.current[index];
    if (!location || !map || !marker) return;
    setActiveLocation(index);
    map.flyTo([location.lat, location.lng], 14, { duration: 0.8 });
    marker.openPopup();
  };

  return (
    <div className="grid overflow-hidden rounded-lg bg-background ring-1 ring-border lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
      <div className="relative min-h-[22rem] sm:min-h-[32rem] lg:min-h-[38rem]">
        <div ref={mapElement} className="absolute inset-0 z-0" aria-label="Peta interaktif lokasi perjalanan Bandung" />
        <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-md bg-background/90 px-3 py-2 text-xs font-medium text-foreground shadow-md backdrop-blur">
          Pilih nomor untuk melihat tujuan
        </div>
      </div>

      <div className="flex flex-col border-t border-border bg-surface-soft lg:border-l lg:border-t-0">
        <ol className="flex-1 divide-y divide-border">
          {locations.map((location, index) => {
            const isActive = index === activeLocation;
            return (
              <li key={location.name} className={isActive ? "bg-accent/30" : "bg-transparent"}>
                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 p-4 sm:p-5">
                  <Button
                    type="button"
                    variant={isActive ? "default" : "secondary"}
                    size="icon"
                    onClick={() => chooseLocation(index)}
                    className="size-9 rounded-full text-sm font-semibold"
                    aria-label={`Tampilkan ${location.name} di peta`}
                    aria-pressed={isActive}
                  >
                    {location.order}
                  </Button>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase text-primary">{location.moment}</p>
                    <h3 className="font-display mt-0.5 text-lg font-semibold">{location.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{location.note}</p>
                    {!location.secret && location.query ? <Button asChild variant="link" size="sm" className="mt-1 h-auto px-0 text-xs">
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.query)}`} target="_blank" rel="noreferrer">
                        Navigasi ke sini <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button> : <p className="mt-2 text-xs font-semibold text-primary">Lokasi tetap rahasia</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-border p-4 sm:p-5">
          <Button asChild variant="getaway" size="getaway" className="w-full">
            <a href={routeUrl} target="_blank" rel="noreferrer"><Navigation /> Buka rute lengkap</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
