"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, LayersControl, LayerGroup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ProviderRow, RequestRow } from "../types";
import { Edit2, ShieldCheck, Phone, Clock } from "lucide-react";

// Fix for Leaflet default icons in Next.js/React
function useLeafletIcons() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
            const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
            const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

            L.Icon.Default.mergeOptions({
                iconRetinaUrl,
                iconUrl,
                shadowUrl,
            });
        }
    }, []);
}

// Custom Icons - Created inside a component or carefully handled
const getIcons = () => {
    if (typeof window === 'undefined') return {};

    return {
        availableIcon: L.divIcon({
            className: "custom-div-icon marker-emerald",
            html: `
                <div class="pulse-ring"></div>
                <div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 4px white; position: relative; z-index: 10;"></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        busyIcon: L.divIcon({
            className: "custom-div-icon marker-violet",
            html: `
                <div class="pulse-ring"></div>
                <div style="background-color: #7c3aed; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 4px white; position: relative; z-index: 10;"></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        offlineIcon: L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color: #64748b; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.4), 0 0 0 3px white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        }),
        pendingRequestIcon: L.divIcon({
            className: "custom-div-icon marker-amber",
            html: `
                <div class="pulse-ring"></div>
                <div style="background-color: #f59e0b; width: 24px; height: 24px; transform: rotate(45deg); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 4px white; position: relative; z-index: 10;"></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        activeRequestIcon: L.divIcon({
            className: "custom-div-icon marker-blue",
            html: `
                <div class="pulse-ring"></div>
                <div style="background-color: #3b82f6; width: 24px; height: 24px; transform: rotate(45deg); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 0 0 4px white; position: relative; z-index: 10;"></div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        })
    };
};

interface ProviderMapClientProps {
    providers: ProviderRow[];
    requests?: RequestRow[];
    onEdit: (provider: ProviderRow) => void;
}

function MapController({ providers }: { providers: ProviderRow[] }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Force multiple resize calculations to ensure Leaflet has correct dimensions
        // Some flex/grid layouts take a few frames to settle.
        const resizer = () => map.invalidateSize();

        const t1 = setTimeout(resizer, 100);
        const t2 = setTimeout(resizer, 500);
        const t3 = setTimeout(resizer, 2000);

        // Fit bounds if providers exist
        const providersWithCoords = providers.filter(p =>
            p.lat !== null && p.lat !== undefined &&
            p.lng !== null && p.lng !== undefined &&
            Math.abs(Number(p.lat)) > 0.01 && Math.abs(Number(p.lng)) > 0.01
        );

        if (providersWithCoords.length > 0) {
            try {
                const bounds = L.latLngBounds(providersWithCoords.map(p => [Number(p.lat), Number(p.lng)] as [number, number]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            } catch (e) {
                console.warn("Could not fit bounds:", e);
            }
        }

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [map, providers]);

    return null;
}

export default function ProviderMapClient({ providers, requests = [], onEdit }: ProviderMapClientProps) {
    useLeafletIcons();
    const [isMounted, setIsMounted] = useState(false);
    const icons = getIcons();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Default center (Accra, Ghana)
    const defaultCenter: [number, number] = [5.6037, -0.1870];

    if (!isMounted) return null;

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 z-0 relative bg-slate-50 min-h-[500px]">
            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-popup-content-wrapper, .leaflet-popup-tip {
                    background: white;
                    color: #0f172a;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    border: 1px solid #e2e8f0;
                }
                .leaflet-popup-close-button {
                    color: #64748b !important;
                }
                .custom-div-icon {
                    background: transparent !important;
                    border: none !important;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 1; }
                    80%, 100% { transform: scale(2); opacity: 0; }
                }
                .pulse-ring {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
                .marker-emerald .pulse-ring { border: 3px solid #10b981; }
                .marker-violet .pulse-ring { border: 3px solid #7c3aed; }
                .marker-amber .pulse-ring { border: 3px solid #f59e0b; }
                .marker-blue .pulse-ring { border: 3px solid #3b82f6; }
            `}} />

            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                scrollWheelZoom={true}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains='abcd'
                    maxZoom={20}
                />

                <MapController providers={providers} />

                <LayersControl position="topright">
                    <LayersControl.Overlay checked name="Providers">
                        <LayerGroup>
                            {providers.map((provider) => {
                                const lat = Number(provider.lat);
                                const lng = Number(provider.lng);
                                if (isNaN(lat) || isNaN(lng) || Math.abs(lat) < 0.01) return null;

                                const position: [number, number] = [lat, lng];

                                const activeJob = requests.find(r => r.provider_id === provider.id && (r.status === 'accepted' || r.status === 'in_progress'));
                                const isBusy = !!activeJob;
                                const isOffline = !provider.is_active;

                                let icon = icons.offlineIcon;
                                let statusColor = "bg-slate-100 text-slate-700";
                                let statusText = "Offline";
                                let circleColor = "#94a3b8";

                                if (!isOffline) {
                                    if (isBusy) {
                                        icon = icons.busyIcon;
                                        statusColor = "bg-violet-100 text-violet-700";
                                        statusText = "Busy (On Job)";
                                        circleColor = "#7c3aed";
                                    } else {
                                        icon = icons.availableIcon;
                                        statusColor = "bg-emerald-100 text-emerald-700";
                                        statusText = "Available";
                                        circleColor = "#10b981";
                                    }
                                }

                                if (!icon) return null;

                                return (
                                    <React.Fragment key={provider.id}>
                                        <Circle
                                            center={position}
                                            radius={(provider.coverage_radius_km || 10) * 1000}
                                            pathOptions={{
                                                color: circleColor,
                                                fillColor: circleColor,
                                                fillOpacity: 0.05,
                                                weight: 1,
                                                dashArray: !isOffline ? undefined : "4 4"
                                            }}
                                        />
                                        <Marker
                                            position={position}
                                            icon={icon}
                                        >
                                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} className="font-sans text-xs font-bold text-slate-900 bg-white border-0 px-2 py-1 rounded shadow-lg">
                                                {provider.display_name} {isBusy && `(Busy)`}
                                            </Tooltip>
                                            <Popup className="admin-map-popup">
                                                <div className="p-1 min-w-[200px]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${statusColor}`}>
                                                            {statusText}
                                                        </span>
                                                        {provider.is_verified && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                                                    </div>

                                                    <h3 className="font-bold text-slate-900 leading-tight mb-1">{provider.display_name}</h3>

                                                    {provider.phone_business && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                                                            <Phone className="h-3 w-3" />
                                                            {provider.phone_business}
                                                        </div>
                                                    )}

                                                    {isBusy && activeJob && (
                                                        <div className="mb-2 p-1.5 bg-violet-50 rounded border border-violet-100 text-xs">
                                                            <p className="text-violet-700 font-medium pb-0.5">Current Job</p>
                                                            <p className="text-slate-600 line-clamp-1">{activeJob.service_id?.replace('_', ' ')}</p>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => onEdit(provider)}
                                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-slate-800 transition-colors mt-2"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                        Edit Details
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </React.Fragment>
                                );
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>

                    <LayersControl.Overlay checked name="Requests">
                        <LayerGroup>
                            {requests.map((req) => {
                                let position: [number, number] | null = null;
                                if (req.location && typeof req.location === 'object' && 'lat' in req.location && 'lng' in req.location) {
                                    position = [(req.location as any).lat, (req.location as any).lng];
                                }

                                if (!position || isNaN(position[0]) || isNaN(position[1])) return null;

                                const assignedProvider = providers.find(p => p.id === req.provider_id);
                                const reqIcon = icons.pendingRequestIcon; // Fallback

                                const currentIcon = req.status === 'pending' ? icons.pendingRequestIcon : icons.activeRequestIcon;

                                if (!currentIcon) return null;

                                return (
                                    <React.Fragment key={req.id}>
                                        {assignedProvider && assignedProvider.lat && assignedProvider.lng && (
                                            <Polyline
                                                positions={[
                                                    position,
                                                    [Number(assignedProvider.lat), Number(assignedProvider.lng)]
                                                ]}
                                                pathOptions={{
                                                    color: '#3b82f6',
                                                    weight: 2,
                                                    dashArray: '5, 10',
                                                    opacity: 0.6
                                                }}
                                            />
                                        )}

                                        <Marker
                                            position={position}
                                            icon={currentIcon}
                                        >
                                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} className="font-sans text-xs font-bold text-slate-900 bg-white border-0 px-2 py-1 rounded shadow-lg">
                                                {req.driver_name || "New Request"} ({req.status})
                                            </Tooltip>
                                            <Popup className="admin-map-popup">
                                                <div className="p-1 min-w-[180px]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {req.status}
                                                        </span>
                                                        <Clock className="h-3 w-3 text-slate-400" />
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 leading-tight mb-1">
                                                        {req.driver_name || "Unknown Driver"}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mb-1 capitalize">{req.service_id?.replace('_', ' ')}</p>

                                                    {assignedProvider && (
                                                        <div className="mt-2 pt-2 border-t border-slate-100">
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Assigned To</p>
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                                {assignedProvider.display_name}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </React.Fragment>
                                );
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        </div>
    );
}
