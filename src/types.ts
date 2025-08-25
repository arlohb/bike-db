export type Ride = {
    id: number,
    gadgetbridge_id: string,
    ride_date: Date,
    distance_km: number,
    duration_sec: number,
    avg_speed_kmh: number,
};

export type RidePoint = {
    id: number,
    ride_id: number,
    timestamp: Date,
    lat: number,
    lon: number,
    ele: number,
    cumulative_distance_km: number,
};

