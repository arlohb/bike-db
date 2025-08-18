import { sql } from "bun";
import type { Ride } from "./types";

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

export default { insert, isGpxPresent };

