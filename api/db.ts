import postgres from "https://deno.land/x/postgresjs@v3.3.4/mod.js";
import { Word } from "./types/word.ts";

export type DatabaseOptions = {
  username: string;
  password: string;
};

export class Database {
  private readonly url: string;
  private readonly options: DatabaseOptions;
  // deno-lint-ignore no-explicit-any
  public sql: any;

  constructor(url: string, options: DatabaseOptions) {
    this.url = url;
    this.options = options;
  }

  async init() {
    // Connect to the database
    this.sql = postgres(this.url, {
      ...this.options,
      database: "words_api",
    });

    // Create the table
    await this.sql`
        CREATE TABLE IF NOT EXISTS word (
                                            id SERIAL,
                                            name VARCHAR(255) NOT NULL
        );
    `;
  }

  async createWord(word: Word) {
    await this.sql`
        INSERT INTO city(id, word)
        VALUES (${word.id}, ${word.name})
    `;
  }

  getWords() {
    return this.sql`
        SELECT id, name
        FROM word
    `;
  }
}
