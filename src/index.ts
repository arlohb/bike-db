import { sql } from "bun";
import { readdir } from "node:fs/promises"
import { getRide, openGpx } from "./gpx";
import db from "./db";
import signale from "signale";

const CHECK_INTERVAL_SECS: number = 10;
const CHECK_PATH: string = "/home/arlo/Nextcloud/BikeDB";
const CHECK_RECURSIVE: boolean = false;

signale.config({
    displayDate: true,
    displayTimestamp: true,
    displayLabel: false,
});

signale.star("==================================");
signale.star("=== Hello from bike-db server! ===");
signale.star("==================================");

signale.await("Starting web server...");

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

signale.start("Web server started!");

const check = async () => {
    signale.await("Scanning folder...");

    const files = (await readdir(CHECK_PATH, { recursive: CHECK_RECURSIVE }))
        .filter(name => name.endsWith(".gpx"))

    const rides = await Promise.all(files
        .map(async file => {
            const gpx = await openGpx(`${CHECK_PATH}/${file}`);
            return getRide(gpx);
        }));

    const doRidesExist = await Promise.all(rides
        .map(ride => db.isGpxPresent(ride.gadgetbridge_id)));

    const newRides = rides
        .filter((_, index) => !doRidesExist[index])

    await Promise.all(newRides.map(ride => {
        signale.pending(`Found ride ${ride.gadgetbridge_id}: ${ride.distance_km.toFixed(1)}km`)
        return db.insert(ride);
    }));

    signale.success(`Scanned folder! Found ${rides.length} total, ${newRides.length} new`);
};

setInterval(check, CHECK_INTERVAL_SECS * 1000);
signale.start("Check timer started!");
check();

