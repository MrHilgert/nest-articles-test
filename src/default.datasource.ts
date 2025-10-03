import { join } from 'path';
import { DataSource } from 'typeorm';

import 'dotenv/config';

export default new DataSource({
    name: 'default',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: true,
    migrationsTableName: 'migrations',
    migrationsRun: false,
});
