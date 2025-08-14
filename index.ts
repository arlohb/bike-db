import { env, SQL } from "bun";

const sql = new SQL({
    hostname: env.POSTGRES_HOST,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWD,
    ssl: false,
});

Bun.serve({
    port: 8080,
    routes: {
        "/get": new Response("Ok"),
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

