import express = require("express");
import { AppDataSource } from "../database/datasource";
import { competitions } from "../database/entity/competitions";
import { matches } from "../database/entity/matches";
import { groupes } from "../database/entity/groupes";

const competitionsRouter = express.Router();

competitionsRouter.get('/', async (req, res) => {
    try  {
        res.send(await AppDataSource.getRepository(competitions).find())
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

competitionsRouter.get('/:id/with-matches/:level?', async (req, res) => {
    try  {
        res.send(await AppDataSource.getRepository(competitions).find({
            where:{
                id: parseInt(req.params.id),
                matchesList: {
                    level: req.params.level ? parseInt(req.params.level) : undefined
                }
            },
            relations:{
                matchesList: {
                    awayTeam: true,
                    homeTeam: true
                }
            }
        }))
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

competitionsRouter.post('/create/:nom', async (req, res) => {
    try  {
        let competion = new competitions()
        competion.name = req.params.nom;
        return res.send(await AppDataSource.getRepository(competitions).save(competion))
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

competitionsRouter.delete('/:id', async (req, res) => {
    try  {
        let competToDelete = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.id)})
        await AppDataSource.getRepository(matches).delete({competion:competToDelete})
        await AppDataSource.getRepository(groupes).delete({competition:competToDelete})
        await AppDataSource.getRepository(competitions).delete(competToDelete)
        res.sendStatus(200)
        
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
});

export { competitionsRouter }