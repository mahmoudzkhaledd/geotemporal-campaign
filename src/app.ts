import { toInt } from "../lib/app-utils";
import { init } from "./init";
import appController from "./routes/app.controller";

async function main() {
  const PORT = toInt(process.env.PORT) ?? 3000;

  const server = await init(appController, "/api/v1");

  server.listen(PORT, () => {
    console.log(
      `Server is listening on port ${PORT} → http://localhost:${PORT}`,
    );
  });
}

main();
