import { readdir } from "node:fs/promises"
import { getRide, openGpx } from "./gpx";
import db from "./db";
import signale from "signale";
import { env, exit } from "node:process";

signale.config({
    displayDate: true,
    displayTimestamp: true,
    displayLabel: false,
});

signale.star("==================================");
signale.star("=== Hello from bike-db server! ===");
signale.star("==================================");

const CHECK_INTERVAL_SECS: number = env.CHECK_INTERVAL_SECS
    ? parseInt(env.CHECK_INTERVAL_SECS)
    : 30;
const CHECK_PATH: string = env.CHECK_PATH ?? "/rides";
const CHECK_RECURSIVE: boolean = env.CHECK_RECURSIVE?.toUpperCase() === "TRUE";

signale.info("Config:")
signale.info(`  CHECK_INTERVAL_SECS: ${CHECK_INTERVAL_SECS}`);
signale.info(`  CHECK_PATH: ${CHECK_PATH}`);
signale.info(`  CHECK_RECURSIVE: ${CHECK_RECURSIVE}`);

try {
    await readdir(CHECK_PATH);
    signale.success(`CHECK_PATH ${CHECK_PATH} does exist!`)
} catch {
    signale.fatal(`CHECK_PATH ${CHECK_PATH} doesn't exist, cannot proceed.`);
    exit(1);
}

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
        .map(([ride, _]) => db.isGpxPresent(ride.gadgetbridge_id)));

    const newRides = rides
        .filter((_, index) => !doRidesExist[index])

    await Promise.all(newRides.map(async ([ride, ridePoints]) => {
        signale.pending(`Found ride ${ride.gadgetbridge_id}: ${ride.distance_km.toFixed(1)}km, ${ridePoints.length} points`)

        const rideDb = await db.insertRide(ride);

        await Promise.all(ridePoints
            .map(point => ({ ride_id: rideDb.id, ...point }))
            .map(db.insertRidePoint))
    }));

    signale.success(`Scanned folder! Found ${rides.length} total, ${newRides.length} new`);
};

setInterval(check, CHECK_INTERVAL_SECS * 1000);
signale.start("Check timer started!");
check();

process.on("SIGTERM", () => {
    signale.await("Exiting...");
    process.exit(0);
});
process.on("SIGINT", () => {
    signale.await("Exiting...");
    process.exit(0);
});

