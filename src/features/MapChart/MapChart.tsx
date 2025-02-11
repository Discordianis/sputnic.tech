import React, { Suspense, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import RouteStore from "../../store/routeStore.tsx";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, Polyline, Marker, useMap} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import {
    ActiveElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./MapChart.css";
import routeStore from "../../store/routeStore.tsx";
import { toJS } from "mobx";
import Loading from "../../components/Loading/Loading.tsx";
import {Reserve, RouteData, RoutePoint} from "../../interfaces/routeInterface.tsx";
import moment from "moment";
import authStore from "../../store/authStore.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const MapChart: React.FC = observer(() => {
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const [filter, setFilter] = useState("7d");
    const [load, setLoad] = useState(true);
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["speed"]);
    const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null);

    const handleChartClick = (_: never, elements: ActiveElement[]) => {
        if (!elements.length) return;
        const index = elements[0].index;
        const point = filteredPoints[index];
        if (point) {
            setSelectedPoint({ lat: point.lat, lng: point.lng });
        }
    };

    useEffect(() => {
        RouteStore.loadRoute(740, "2025-02-05 06:13:02", "2025-02-07 17:53:24").then();
    }, []);

    useEffect(() => {
        if (routeStore.route) {
            setRouteData(toJS(routeStore.route?.[740]?.[0]));
        }
    }, [routeStore.route, authStore.token]);

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
    const labels = filteredPoints.map((point) => moment(point.datetime).format('DD.MM.YYYY, HH:mm'));

    const specs = ['speed', 'voltage', 'alt', 'direction', 'fuel1', 'ignition']

    const colors: { [key: string]: string } = {
        speed: "rgb(255, 99, 132)",
        voltage: "rgb(54, 162, 235)",
        alt: "rgb(255, 206, 86)",
        direction: "rgb(75, 192, 192)",
        fuel1: "rgb(153, 102, 255)",
        ignition: "rgb(255, 159, 64)",
    };
    const bgcolors: { [key: string]: string } = {
        speed: "rgb(97,38,51)",
        voltage: "rgb(18,50,73)",
        alt: "rgb(90,73,30)",
        direction: "rgb(28,73,73)",
        fuel1: "rgb(45,30,76)",
        ignition: "rgb(78,49,20)",
    };

    const handleCheckboxChange = (metric: string) => {
        setSelectedMetrics((prev) =>
            prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
        );
    };

    const data = {
        labels: labels,
        datasets: selectedMetrics.map((metric) => ({
            label: metric,
            data: filteredPoints.map((point: RoutePoint) => point.reserve[metric as keyof Reserve] as number),
            borderColor: colors[metric as keyof typeof colors],
            backgroundColor: bgcolors[metric as keyof typeof colors],
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: handleChartClick,
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    display: false
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
                        center={selectedPoint || (filteredPoints.length > 0 ? [filteredPoints[0].lat, filteredPoints[0].lng] : [52, 50]) as LatLngExpression}
                        zoom={10}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {filteredPoints.length > 0 && (
                            <>
                                <Polyline positions={filteredPoints.map((point) => [point.lat, point.lng]) as LatLngExpression[]} pathOptions={{ color: "blue" }} />
                                <Marker position={[filteredPoints[0].lat, filteredPoints[0].lng] as LatLngExpression} />
                            </>
                        )}

                        {selectedPoint && <Marker position={[selectedPoint.lat, selectedPoint.lng] as LatLngExpression} />}
                        {selectedPoint && <MapCenter position={selectedPoint} />}
                    </MapContainer>
                </div>
                <div className="chart" style={{height: "435px"}}>
                    <div className={'charts_header'}>
                        <div className={'charts_checkboxes'}>
                            {specs.map((metric, index) => (
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMetrics.includes(metric)}
                                        onChange={() => handleCheckboxChange(metric)}
                                    />
                                    {metric}
                                </label>
                            ))}
                        </div>
                        <div className={'charts_select'}>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="1h">За час</option>
                                <option value="2h">За 2 часа</option>
                                <option value="3h">За 3 часа</option>
                                <option value="6h">За 6 часов</option>
                                <option value="12h">За 12 часов</option>
                                <option value="24h">За 24 часа</option>
                                <option value="7d">За 7 дней</option>
                            </select>
                        </div>
                    </div>
                    <Line data={data} options={options}/>
                </div>
            </div>
        </Suspense>
    );
});

const MapCenter: React.FC<{ position: { lat: number; lng: number } }> = ({position}) => {
    const map = useMap();
    useEffect(() => {
        map.setView([position.lat, position.lng], 12);
    }, [position, map]);

    return null;
};

export default MapChart;
