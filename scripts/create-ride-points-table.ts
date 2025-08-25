import { sql } from "bun";

await sql`CREATE TABLE IF NOT EXISTS ride_points (
    id BIGSERIAL PRIMARY KEY,
    ride_id INT REFERENCES rides(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    ele DOUBLE PRECISION,
    cumulative_distance_km DOUBLE PRECISION
)`;

await sql`CREATE INDEX IF NOT EXISTS ride_points_ride_id_timestamp_idx
  ON ride_points (ride_id, timestamp)
`;

