FROM peaceiris/hugo:v0.124.0-full AS builder

WORKDIR /site

COPY . .

RUN hugo --gc --minify

FROM nginx:alpine

COPY --from=builder /site/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
