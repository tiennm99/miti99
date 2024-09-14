FROM ubuntu:latest

ENV HUGO_VERSION=0.124.0
ENV HUGO_ENVIRONMENT=production
ENV HUGO_ENV=production

RUN apt-get update && apt-get install -y \
    git \
    golang \
    nodejs \
    npm \
    wget

RUN wget -O /tmp/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-arm64.deb \
    && dpkg -i /tmp/hugo.deb \
    && rm /tmp/hugo.deb

RUN npm install -g sass

WORKDIR /src

COPY . .

RUN [ -f package-lock.json ] && npm ci || echo "No package-lock.json found. Skipping npm ci."

RUN hugo --gc --minify

WORKDIR /src/public