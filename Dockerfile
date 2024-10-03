FROM ghcr.io/gohugoio/hugo:v0.135.0 AS builder
WORKDIR /app
COPY . .
ARG BASE_URL
RUN hugo --gc --minify --cleanDestinationDir -b "${BASE_URL}"

FROM nginx:alpine AS runner
COPY --from=builder /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
