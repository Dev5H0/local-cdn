FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY server.ts ./
COPY public ./public 

VOLUME ["/app/public"]

EXPOSE 3000

CMD ["bun", "server.ts"]
