import { sql } from "bun";

interface Ride {
    id: number,
    ride_date: Date,
    distance_km: number,
    duration_sec: number,
    avg_speed_kmh: number,
};

const parseRide = (ride: any): Ride => ({
    id: ride.id,
    ride_date: ride.ride_date,
    distance_km: parseFloat(ride.distance_km),
    duration_sec: parseFloat(ride.duration_sec),
    avg_speed_kmh: parseFloat(ride.avg_speed_kmh),
});

Bun.serve({
    port: 8080,
    routes: {
        "/get": async () => {
            const rides: Ride[] = (await sql`SELECT * FROM rides`)
                .map(parseRide);

            for (const ride of rides) {
                console.log(ride);
            }

            return new Response(rides.map(r => JSON.stringify(r)).join());
        },
        "/add": () => {
            const ride = {
                ride_date: "",
                distance_km: 0,
                duration_secs: 5895,
                avg_speed: 26.10,
            };
            sql`INSERT INTO rides ${sql(ride)}`
            return new Response("Ok");
        },
    },
});

