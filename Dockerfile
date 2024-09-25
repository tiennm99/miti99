FROM hugomods/hugo:exts-0.124.0 AS builder
WORKDIR /srv/hugo
COPY . .
RUN chown 1000:1000 -R /srv/hugo
RUN hugo --gc --minify --cleanDestinationDir --baseURL "${BASE_URL}"

FROM nginx:alpine
COPY --from=builder /srv/hugo/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
