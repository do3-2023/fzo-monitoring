import {
  Application,
  Router,
  RouterContext,
  Status,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";

import {
  randomItem
} from "https://deno.land/x/random_item/mod.ts";

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
      .post("/word", this.createWord.bind(this))
      .get("/word", this.getRandomWord.bind(this))
      .get("/healthz", this.getHealth.bind(this));

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async run(address: string, port: number) {
    // Start the application
    await this.app.listen(`${address}:${port}`);
  }

  async createWord(ctx: RouterContext<"/word">) {
    const body = await ctx.request.body({ type: "json" });
    const value = await body.value;

    if (!value) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = "Missing request body";

      return;
    }

    // Ensure the required fields are present
    if (!value.id) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = "Missing id";

      return;
    }

    if (!value.name) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = "Missing name";

      return;
    }

    await this.db.createWord(value);
    ctx.response.status = Status.Created;
  }

  async getRandomWord(ctx: RouterContext<"/word">) {
    const words = await this.db.getWords();
    if (words.length == 0) {
      ctx.response.body = [];
    } else {
      ctx.response.body = randomItem(words);
    }
  }

  getHealth(ctx: RouterContext<"/healthz">) {
    ctx.response.status = Status.NoContent;
  }
}