import React, { Suspense, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import RouteStore from "../../store/routeStore.tsx";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import "./MapChart.css";
import routeStore from "../../store/routeStore.tsx";
import { toJS } from "mobx";
import Loading from "../../components/Loading/Loading.tsx";
import {RouteData, RoutePoint} from "../../interfaces/routeInterface.tsx";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const MapChart: React.FC = observer(() => {
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const [filter, setFilter] = useState("7d");
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (routeStore.route) {
            setRouteData(toJS(routeStore.route?.[740]?.[0]));
        }
    }, [routeStore.route]);

    const routePoints = routeData?.route || [];

    const filterData = (points: RoutePoint[]) => {
        if (!points.length) return [];

        const startTimestamp = new Date(points[0].datetime).getTime();

        return points.filter((point: RoutePoint) => {
            const pointTime = new Date(point.datetime).getTime();

            switch (filter) {
                case "1h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000;
                case "2h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 2;
                case "3h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 3;
                case "6h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 6;
                case "12h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 12;
                case "24h": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 24;
                case "7d": return pointTime >= startTimestamp && pointTime <= startTimestamp + 3600000 * 24 * 7;
                default: return true;
            }
        });
    };


    const filteredPoints = filterData(routePoints);
    const labels = filteredPoints.map((point) => moment(point.datetime).format('DD.MM.YYYY, HH:MM'));

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Speed",
                data: filteredPoints.map((point: RoutePoint) => point.speed),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    maxRotation: 0
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Speed Chart",
            },
        },
    };

    useEffect(() => {
        RouteStore.loadRoute(740, "2025-02-05 06:13:02", "2025-02-07 17:53:24").then();
    }, []);

    setTimeout(() => {
        setLoad(false);
    }, 2000);

    if (load) {
        return <Loading />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="map_chart_root">
                <div className="map">
                    <MapContainer
                        center={filteredPoints.length > 0 ? [filteredPoints[0]?.lat, filteredPoints[0]?.lng] : [52, 50] as LatLngExpression}
                        zoom={10}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {filteredPoints.length > 0 && (
                            <>
                                <Polyline
                                    positions={filteredPoints.map((point) => [point.lat, point.lng]) as LatLngExpression[]}
                                    pathOptions={{ color: "blue" }}
                                />
                                <Marker position={[filteredPoints[0]?.lat, filteredPoints[0]?.lng] as LatLngExpression} />
                            </>
                        )}
                    </MapContainer>
                </div>
                <div className="chart" style={{ height: "435px" }}>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="1h">За час</option>
                        <option value="2h">За 2 часа</option>
                        <option value="3h">За 3 часа</option>
                        <option value="6h">За 6 часов</option>
                        <option value="12h">За 12 часов</option>
                        <option value="24h">За 24 часа</option>
                        <option value="7d">За 7 дней</option>
                    </select>
                    <Line data={data} options={options} />
                </div>
            </div>
        </Suspense>
    );
});

export default MapChart;
