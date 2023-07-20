import { Database } from "./src/db.ts";
import { Config } from "./src/config.ts";
import { WebServer } from "./src/webserver.ts";

// Load configuration
const config = new Config();
config.initFromEnv();

// Connect to the database
const db = new Database(config.databaseUrl, config.databaseDatabase, {
  username: config.databaseUser,
  password: config.databasePassword,
});

await db.init();

// Start the web server
const webServer = new WebServer(db);
webServer.init();

console.log(
  `Starting web server on ${config.httpServerAddress}:${config.httpServerPort}`,
);
await webServer.run(config.httpServerAddress, config.httpServerPort);
