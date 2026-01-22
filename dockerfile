# build frontend
FROM oven/bun:1 AS frontend-builder
WORKDIR /usr/sv-store.liara.io/

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM frontend-builder AS install
RUN mkdir -p /temp/dev
COPY /package.json /bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY /package.json /bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
FROM frontend-builder AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY / .

# build using npm because running vite commands via bun hangs indefinitely
FROM node:20 AS release
WORKDIR /usr/sv-store.liara.io/
COPY --from=prerelease /usr/sv-store.liara.io/ .
COPY --from=install /temp/prod/node_modules node_modules
RUN npm run dockerbuild

# final image
FROM nginx AS production
COPY --from=release /usr/sv-store.liara.io/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
