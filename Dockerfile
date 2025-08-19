# In theory we can compile to a single executable for performance,
# But I couldn't get this to work, maybe in the future?

FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install deps into temp dir
# This caches them to speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev
RUN cd /temp/dev && bun install --frozen-lockfile

# Install deps into temp dir, without devDependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp, then all project files
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copy prod dependencies and src into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src/* src/
COPY --from=prerelease /usr/src/app/package.json .

# Run the app
USER bun
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

