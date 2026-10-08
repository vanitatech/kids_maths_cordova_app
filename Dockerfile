FROM node:22-alpine AS build
WORKDIR /build
COPY tools/build-browser.mjs tools/build-browser.mjs
COPY www www
ARG RELEASE_SHA
RUN RELEASE_SHA="$RELEASE_SHA" node tools/build-browser.mjs /site

FROM scratch
COPY --from=build /site /site
# Delivery package only: deploy with docker cp, never run this image.
CMD ["/not-executed"]
