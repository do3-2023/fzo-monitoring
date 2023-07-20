export class Config {
  public httpServerAddress: string;
  public httpServerPort: number;

  public databaseUrl: string;
  public databaseUser: string;
  public databasePassword: string;
  public databaseDatabase: string;

  initFromEnv() {
    // Ensure mandatory variables are present
    if (!Deno.env.has("DB_URL")) {
      throw new Error("Please set the DB_URL environment variable.");
    }

    if (!Deno.env.has("DB_USER")) {
      throw new Error("Please set the DB_USER environment variable.");
    }

    if (!Deno.env.has("DB_PWD")) {
      throw new Error("Please set the DB_PWD environment variable.");
    }

    if (!Deno.env.has("DB_DB")) {
      throw new Error("Please set the DB_DB environment variable.");
    }

    // Get the configuration
    this.httpServerAddress = Deno.env.get("ADDR") || "0.0.0.0";
    this.httpServerPort = Deno.env.get("PORT") || 80;

    this.databaseUrl = Deno.env.get("DB_URL");
    this.databaseUser = Deno.env.get("DB_USER");
    this.databasePassword = Deno.env.get("DB_PWD");
    this.databaseDatabase = Deno.env.get("DB_DB");
  }
}
