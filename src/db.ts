import { sql } from "bun";
import type { Ride, RidePoint } from "./types";

const insertRide = async (ride: Omit<Ride, "id">): Promise<Ride> => {
    const [rideDb] = await sql`INSERT INTO rides ${sql(ride)} RETURNING *`;
    return rideDb;
};

const insertRidePoint = (ridePoint: Omit<RidePoint, "id">): Promise<void> =>
    sql`INSERT INTO ride_points ${sql(ridePoint)}`;

const isGpxPresent = async (gadgetbridge_id: string): Promise<boolean> => {
    const [{ exists }] = await sql`
        SELECT EXISTS(
            SELECT 1 FROM rides
            WHERE gadgetbridge_id=${gadgetbridge_id}
        )
    `;
    return exists;
}

export default { insertRide, insertRidePoint, isGpxPresent };

