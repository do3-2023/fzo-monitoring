import postgres from "https://deno.land/x/postgresjs@v3.3.4/mod.js";
import { Timestamp } from "./types/timestamp.ts";

export type DatabaseOptions = {
  username: string;
  password: string;
};

export class Database {
  private readonly url: string;
  private readonly database_name: string;
  private readonly options: DatabaseOptions;
  // deno-lint-ignore no-explicit-any
  public sql: any;

  constructor(url: string, database: string, options: DatabaseOptions) {
    this.url = url;
    this.database_name = database;
    this.options = options;
  }

  async init() {
    // Connect to the database
    this.sql = postgres(this.url, {
      ...this.options,
      database: this.database_name,
    });

    // Create the table
    await this.sql`
        CREATE TABLE IF NOT EXISTS time (timestamp TIMESTAMP UNIQUE NOT NULL);
    `;
  }

  async createTimestamp(timestamp: Timestamp) {
    await this.sql`
        INSERT INTO time(timestamp)
        VALUES (${timestamp.timestamp})
    `;
  }

  getLastFiveTimestamps() {
    return this.sql`
        SELECT timestamp
        FROM time
        ORDER BY timestamp DESC
        LIMIT 5
    `;
  }

  async checkConnectivity() {
    try {
      await this.sql`SELECT 1 FROM time`;
      return true;
    } catch (e) {
      return false;
    }
  }
}
