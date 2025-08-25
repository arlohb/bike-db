import gpxParser from "gpxparser";
import type { Ride, RidePoint } from "./types";

export const openGpx = async (path: string): Promise<gpxParser> => {
    const xml = await Bun.file(path).text();

    const gpx = new gpxParser();
    gpx.parse(xml);
    return gpx;
};

export const getRide = (gpx: gpxParser): [Omit<Ride, "id">, Omit<RidePoint, "id" | "ride_id">[]] => {
    const track = gpx.tracks[0]!;
    const startTime = new Date(track.points[0]!.time);
    const endTime = new Date(gpx.metadata.time);
    const distanceKm = track.distance.total / 1000;
    const durationSec = (endTime.getTime() - startTime.getTime()) / 1000;

    const ride: Omit<Ride, "id"> = {
        ride_date: startTime,
        gadgetbridge_id: gpx.metadata.name,
        distance_km: distanceKm,
        duration_sec: durationSec,
        avg_speed_kmh: 60 * 60 * distanceKm / durationSec,
    };

    // This is typed incorrectly
    const distances = track.distance.cumul as unknown as number[];

    const ridePoints: Omit<RidePoint, "id" | "ride_id">[] = track.points.map((point, i) => {
        return {
            timestamp: point.time,
            lat: point.lat,
            lon: point.lon,
            ele: point.ele,
            cumulative_distance_km: (distances[i] ?? 0) / 1000,
        };
    });

    return [ ride, ridePoints ];
};

