import Knex from 'knex';

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './database.db',
  },
  useNullAsDefault: true,
});

export class Database {
  table: string;
  knex: Knex;

  constructor(table: string) {
    this.table = table;
    this.knex = knex;
  }

  async safe() {
    await this.ensureTable();
    return this;
  }

  async ensureTable() {
    let exists = await this.knex.schema.hasTable(this.table);
    if (exists) return;
    await this.knex.schema.createTable(this.table, (t) => {
      t.string('key').primary();
      t.json('value');
    });
    console.log(`Creating table ${this.table}`);
  }

  async get(key: string) {
    let rows = await this.knex.select('*').from(this.table).where('key', key);
    if (!rows.length) return null;
    return JSON.parse(rows[0].value);
  }
  async all() {
    let rows = await this.knex.select('*').from(this.table);
    return rows;
  }

  async set(key: string, value: any) {
    let rows = await this.knex.select('*').from(this.table).where('key', key);
    if (!rows.length) {
      await this.knex(this.table).insert({
        key: key,
        value: JSON.stringify(value),
      });
    } else {
      await this.knex(this.table)
        .where('key', key)
        .update({
          key: key,
          value: JSON.stringify(value),
        });
    }
  }

  async delete(key: string) {
    await this.knex(this.table).where('key', key).del();
  }

  async ensure(key: string, value: any) {
    let rows = await this.knex.select('*').from(this.table).where('key', key);
    if (!rows.length) {
      await this.knex(this.table).insert({
        key: key,
        value: JSON.stringify(value),
      });
    }
  }
}
