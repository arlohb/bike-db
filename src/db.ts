import { sql } from "bun";
import type { Ride } from "./types";

const parseRide = (ride: any): Ride => ({
    id: ride.id,
    gadgetbridge_id: ride.gadgetbridge_id,
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
    await sql`INSERT INTO rides ${sql(ride)}`
};

const isGpxPresent = async (gadgetbridge_id: string): Promise<boolean> => {
    const [{ exists }] = await sql`
        SELECT EXISTS(
            SELECT 1 FROM rides
            WHERE gadgetbridge_id=${gadgetbridge_id}
        )
    `;
    return exists;
}

export default { get, insert, isGpxPresent };

