import * as dotenv from 'dotenv';
dotenv.config()
export default {
    PORT: process.env.PORT,
    DBPORT: parseInt(process.env.DBPORT),
    DBHOST: process.env.DBHOST,
    DBNAME: process.env.DBNAME,
    DBUSER: process.env.DBUSER,
    DBPASSWORD: process.env.DBPASSWORD,
    ENVIRONMENT: process.env.ENVIRONMENT,
};
