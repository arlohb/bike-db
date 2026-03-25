# bike-db

**Store your GPX files in a SQL database to analyse them in novel ways**

I use this project to store my bike rides in PostgreSQL to then analyse them in
Grafana. This gives me full control over the data, and allows me to use Grafana
and SQL's full power to my advantage.

At regular intervals, it will check for new rides in the given path, and add
them to the database.

# Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

Alternatively, there is a docker image which can be used.

```bash
docker run -d \
    --name bike-db \
    --restart unless-stopped \
    -e PGHOST=<db-host> \
    -e PGPORT=5432 \
    -e PGDATABASE=<db-name> \
    -e PGUSERNAME=<db-user> \
    -e PGPASSWORD=<db-password> \
    -v <local-data-dir>:/rides \
    ghcr.io/arlohb/bike-db:v0.0.2
```

Configuration is driven by environment variables

| Variable              | Default | Description                          |
|-----------------------|---------|--------------------------------------|
| `CHECK_INTERVAL_SECS` | 30      | How often to check the GPX folder    |
| `CHECK_PATH`          | /rides  | The path containing the GPX files    |
| `CHECK_RECURSIVE`     | TRUE    | Whether to check folders recursively |

Additional environment variables are used for the database connection: follow
the Bun documentation for [PostgreSQL](https://bun.com/docs/runtime/sql#postgresql-environment-variables).
Only PostgreSQL is supported currently due to using an older Bun version, I hope
to rectify this when I get time.

