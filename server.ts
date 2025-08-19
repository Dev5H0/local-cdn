import cors from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

const PREFIX_ASSETS = "/assets";

const app = new Elysia()
    .use(cors({ origin: true }))
    .use(
        staticPlugin({
            assets: "public",
            prefix: PREFIX_ASSETS,
            indexHTML: false,
        }),
    )

    .onAfterHandle(({ path, set }) => {
        if (path.startsWith(`${PREFIX_ASSETS}/`)) {
            set.headers["cache-control"] =
                Bun.env.NODE_ENV === "production"
                    ? "public, mage-age=3156000, immutable"
                    : "no-cache";
            set.headers["timing-allow-origin"] = "*";
            set.headers["access-control-expose-headers"] =
                "ETag, Content-Length";
        }
    })

    .get("/", () => {
        return new Response(
            `<h1>Local CDN</h1>
      <p>Try <code>${PREFIX_ASSETS}/docs</code> or <code>${PREFIX_ASSETS}/imgs</code></p>`,
            {
                headers: {
                    "Content-Type": "text/html, charset=utf-8",
                },
            },
        );
    })
    .listen(2005);

console.log(
    `Local CDN running -> ${app.server?.hostname}:${app.server?.port}${PREFIX_ASSETS}`,
);
