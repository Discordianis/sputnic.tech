import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import RouteStore from "../../store/routeStore";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";

const MapComponent: React.FC = observer(() => {
    useEffect(() => {
        RouteStore.loadRoute(740, "2025-02-05 06:13:02", "2025-02-07 17:53:24");
    }, []);

    return (
        <MapContainer center={[55.751244, 37.618423]} zoom={10} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {RouteStore.route.length > 0 && (
                <>
                    <Polyline positions={RouteStore.route.map((point) => [point.lat, point.lng])} color="blue" />
                    <Marker position={[RouteStore.route[0].lat, RouteStore.route[0].lng]} />
                </>
            )}
        </MapContainer>
    );
});

export default MapComponent;
