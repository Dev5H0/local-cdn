import { join } from "node:path";
import cors from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";

const DIR_ASSETS = "/assets";
const DIR_UPLOAD = "public/uploads";

const app = new Elysia()
  .use(cors({ origin: true }))
  .use(
    staticPlugin({
      assets: "public",
      prefix: DIR_ASSETS,
      indexHTML: false,
    }),
  )

  .onAfterHandle(({ path, set }) => {
    if (path.startsWith(`${DIR_ASSETS}/`)) {
      set.headers["cache-control"] = Bun.env.NODE_ENV === "production" ? "public, mage-age=3156000, immutable" : "no-cache";
      set.headers["timing-allow-origin"] = "*";
      set.headers["access-control-expose-headers"] = "ETag, Content-Length";
    }
  })

  .get("/", () => {
    return new Response(
      `
                <form method="POST" action="/upload" enctype="multipart/form-data">
                    <input type="file" name="files" multiple />
                    <button type="submit">Upload</button>
                </form>
                <p>Uploads available at: <code>${DIR_ASSETS}/uploads/...</code></p>
            `,
      {
        headers: {
          "Content-Type": "text/html, charset=utf-8",
        },
      },
    );
  })

  .post(
    "/upload",
    async ({ body: { files } }) => {
      [...files].forEach(async (f) => {
        await Bun.write(join(DIR_UPLOAD, f.name), f);
      });
      return files;
    },
    {
      body: t.Object({
        files: t.Files(),
      }),
      parse: "multipart/form-data",
    },
  )

  .listen(Bun.env.PORT || 3000);

console.log(`Local CDN running -> ${app.server?.hostname}:${app.server?.port}`);
