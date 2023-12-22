import { DataSource } from "typeorm"
import config from '../config'
console.log(config)

const isProduction = config.ENVIRONMENT === 'BUILD';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DBHOST,
    port: config.DBPORT,
    username: config.DBUSER,
    password: config.DBPASSWORD,
    database: config.DBNAME,
    entities: isProduction ? ["build/database/entity/**/*.js"] : ["src/database/entity/**/*.ts"],
    logging: false,
    synchronize: true
})
