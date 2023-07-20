import {
  Application,
  Router,
  RouterContext,
  Status,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";

import { Database } from "./db.ts";

export class WebServer {
  private db: Database;

  private app: Application;
  private router: Router;

  constructor(db: Database) {
    this.db = db;

    // Create the application
    this.app = new Application();
    this.router = new Router();
  }

  init() {
    // Add the routes
    this.router
      .get("/", this.timestamp.bind(this))
      .get("/healthz", this.getHealth.bind(this));

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async run(address: string, port: number) {
    // Start the application
    await this.app.listen(`${address}:${port}`);
  }

  async timestamp(ctx: RouterContext<"/">) {
    const lastTimestamps = await this.db.getLastFiveTimestamps();

    try {
      await this.db.createTimestamp({
        timestamp: new Date(new Date().toUTCString()).getTime()
      });
    } catch (e) {}

    ctx.response.body = lastTimestamps;
  }

  async getHealth(ctx: RouterContext<"/healthz">) {
    if (await this.db.checkConnectivity()) {
      ctx.response.body = "Healthy";
    } else {
      ctx.response.body = "Unhealthy";
      ctx.response.status = Status.ServiceUnavailable;
    }
  }
}
