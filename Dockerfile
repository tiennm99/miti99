FROM golang:1.22 AS builder

RUN apt-get update && apt-get install -y git
RUN go install -tags extended github.com/gohugoio/hugo@0.124.0

WORKDIR /site

COPY . .

RUN hugo --minify

FROM nginx:alpine

COPY --from=builder /site/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
