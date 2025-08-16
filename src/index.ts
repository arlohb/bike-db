import { sql } from "bun";
import { readdir } from "node:fs/promises"
import { getRide, openGpx } from "./gpx";
import db from "./db";

const CHECK_INTERVAL_SECS: number = 10;
const CHECK_PATH: string = "/home/arlo/Nextcloud/BikeDB";
const CHECK_RECURSIVE: boolean = false;

Bun.serve({
    port: 8080,
    routes: {
        "/get": async () => {
            const rides = await db.get();

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

const check = async () => {
    const files = (await readdir(CHECK_PATH, { recursive: CHECK_RECURSIVE }))
        .filter(name => name.endsWith(".gpx"))

    for (const file of files) {
        const gpx = await openGpx(`${CHECK_PATH}/${file}`);
        const ride = getRide(gpx);
        const exists = await db.isGpxPresent(ride.gadgetbridge_id);
        if (!exists) {
            await db.insert(ride);
        }
    }
};

setInterval(check, CHECK_INTERVAL_SECS * 1000);
check();

