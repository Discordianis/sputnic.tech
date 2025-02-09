import React from "react";
import { observer } from "mobx-react-lite";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import RouteStore from "../../store/routeStore";

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartComponent: React.FC<{ onPointClick: (lat: number, lng: number) => void }> = observer(({ onPointClick }) => {
    const labels = RouteStore.route.map((_, index) => `Точка ${index + 1}`);
    const dataSets = Object.keys(RouteStore.route[0]?.reserve || {}).map((key) => ({
        label: key,
        data: RouteStore.route.map((point) => point.reserve[key]),
        borderColor: "blue",
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "red",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const point = RouteStore.route[index];
                onPointClick(point.lat, point.lng);
            }
        },
    }));

    return (
        <Line
            data={{
                labels,
                datasets: dataSets,
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
                        },
                    },
                },
            }}
        />
    );
});

export default ChartComponent;
