import { sql } from "bun";
import { getRide, openGpx } from "./gpx";
import db from "./db";

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

const gpx = await openGpx("/home/arlo/Nextcloud/tmp/gadgetbridge-running-20250814a.gpx");
console.log(getRide(gpx));

