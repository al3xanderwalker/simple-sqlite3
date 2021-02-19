import Knex from 'knex';
export declare class Database {
    table: string;
    knex: Knex;
    constructor(table: string);
    safe(): Promise<this>;
    ensureTable(): Promise<void>;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    ensure(key: string, value: string): Promise<void>;
    ensureJSON(key: string, data: object): Promise<void>;
}
//# sourceMappingURL=Database.d.ts.map