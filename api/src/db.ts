import postgres from "https://deno.land/x/postgresjs@v3.3.4/mod.js";
import { Person } from "./types/person.ts";

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
    this.sql = postgres('postgres://' + this.url, {
      ...this.options,
      database: this.database_name,
    });
  }

  async create(person: Person) {
    await this.sql`
        INSERT INTO person(last_name, phone_number, location)
        VALUES (${person.last_name}, ${person.phone_number}, ${person.location})
    `;
  }

  getAll() {
    return this.sql`SELECT * FROM person`;
  }

  async checkConnectivity() {
    try {
      await this.sql`SELECT 1 FROM person`;
      return true;
    } catch (e) {
      return false;
    }
  }
}
