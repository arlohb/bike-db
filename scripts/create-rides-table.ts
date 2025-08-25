import { sql } from "bun";

await sql`CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    gadgetbridge_id CHAR(9) NOT NULL,
    ride_date TIMESTAMP NOT NULL,
    distance_km NUMERIC(6,2) NOT NULL,
    duration_sec INT NOT NULL,
    avg_speed_kmh NUMERIC(5,2) NOT NULL
);`

