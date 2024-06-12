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
      .get("/", this.getAll.bind(this))
      .post("/", this.addNew.bind(this))
      .get("/healthz", this.getHealth.bind(this));

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async run(address: string, port: number) {
    // Start the application
    await this.app.listen(`${address}:${port}`);
  }

  async getAll(ctx: RouterContext<"/">) {
    ctx.response.body = await this.db.getAll();
  }

  async addNew(ctx: RouterContext<"/">) {
    await this.db.create({
      last_name: "Test",
      phone_number: "0612345678",
      location: "Montpellier"
    });
    ctx.response.body = "OK";
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
