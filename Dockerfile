FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY server.ts ./
COPY public ./public 

EXPOSE 2005

CMD ["bun", "server.ts"]
