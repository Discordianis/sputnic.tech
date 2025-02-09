import React, { useEffect } from "react";
import routeStore from "../../store/routeStore";
import Map from "../../components/Map/Map.tsx";
import Chart from "../../components/Chart/Chart.tsx";

const Dashboard: React.FC = () => {
    useEffect(() => {
        routeStore.loadRoute(740, "2025-02-05 06:13:02", "2025-02-07 17:53:24").then();
        console.log(routeStore.route)
    }, []);

    return (
        <div>
            <h1>Маршрут</h1>
            <Map />
            <h1>График</h1>
            <Chart />
        </div>
    );
};

export default Dashboard;
