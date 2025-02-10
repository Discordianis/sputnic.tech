import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import RouteStore from "../../store/routeStore.tsx";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import './MapChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface RoutePoint {
    lat: number;
    lng: number;
    reserve: Record<string, number>;
}

const MapChart: React.FC = observer(() => {
    const routePoints: RoutePoint[] = Object.values(RouteStore.route ?? {})
        .flatMap((n740) => Object.values(n740 as Record<string, object>))
        .flatMap((n0) => Object.values(n0 as { route?: Record<string, RoutePoint> }))
        .flatMap((route) => Object.values(route.route ?? {}));

    const labels = routePoints.map((_, index) => `Точка ${index + 1}`);

    const dataSets =
        routePoints.length > 0
            ? Object.keys(routePoints[0].reserve).map((key) => ({
                label: key,
                data: routePoints.map((point) => point.reserve[key]),
                borderColor: "blue",
                fill: false,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "red",
                pointBorderColor: "white",
                pointBorderWidth: 2,
            }))
            : [];

    const handleChartClick = (_: unknown, elements: { index: number }[]) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const point = routePoints[index];
            console.log(`Координаты точки: ${point.lat}, ${point.lng}`);
        }
    };

    useEffect(() => {
        RouteStore.loadRoute(740, "2025-02-05 06:13:02", "2025-02-07 17:53:24").then();
    }, []);

    return (
        <div className={"map_chart_root"}>
            <div className={"map"}>
                <MapContainer
                    center={[55.751244, 37.618423] as LatLngExpression}
                    zoom={10}
                    style={{ height: "600px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {routePoints.length > 0 && (
                        <>
                            <Polyline
                                positions={routePoints.map((point) => [point.lat, point.lng]) as LatLngExpression[]}
                                pathOptions={{ color: "blue" }}
                            />
                            <Marker position={[routePoints[0].lat, routePoints[0].lng] as LatLngExpression} />
                        </>
                    )}
                </MapContainer>
            </div>
            <div className={"chart"}>
                <Line
                    data={{
                        labels,
                        datasets: dataSets,
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        onClick: handleChartClick,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
});

export default MapChart;
