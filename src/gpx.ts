import gpxParser from "gpxparser";
import type { Ride } from "./types";

export const openGpx = async (path: string): Promise<gpxParser> => {
    const xml = await Bun.file(path).text();

    const gpx = new gpxParser();
    gpx.parse(xml);
    return gpx;
};

export const getRide = (gpx: gpxParser): Omit<Ride, "id"> => {
    const track = gpx.tracks[0]!;
    const startTime = new Date(track.points[0]!.time);
    const endTime = new Date(gpx.metadata.time);
    const distanceKm = track.distance.total / 1000;
    const durationSec = (endTime.getTime() - startTime.getTime()) / 1000;

    return {
        ride_date: startTime,
        gadgetbridge_id: gpx.metadata.name,
        distance_km: distanceKm,
        duration_sec: durationSec,
        avg_speed_kmh: 60 * 60 * distanceKm / durationSec,
    }
};

