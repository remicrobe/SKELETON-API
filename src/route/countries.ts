import express = require("express");
import { AppDataSource } from "../database/datasource";
import { countries } from "../database/entity/coutries";

const countriesRouter = express.Router();


countriesRouter.get('/', async (req, res) => {
    try  {
        res.send(await AppDataSource.getRepository(countries).find())
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

export { countriesRouter }