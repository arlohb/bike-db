import { sql } from "bun";
import type { Ride } from "./types";

const parseRide = (ride: any): Ride => ({
    id: ride.id,
    ride_date: ride.ride_date,
    distance_km: parseFloat(ride.distance_km),
    duration_sec: parseFloat(ride.duration_sec),
    avg_speed_kmh: parseFloat(ride.avg_speed_kmh),
});

const get = async (): Promise<Ride[]> => {
    return (await sql`SELECT * FROM rides`)
        .map(parseRide);
};

const insert = async (ride: Omit<Ride, "id">): Promise<void> => {
    sql`INSERT INTO rides ${sql(ride)}`
};

export default { get, insert };

