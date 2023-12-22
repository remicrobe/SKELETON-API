import * as express from 'express'

import { AppDataSource } from "../database/datasource";
import { countries } from "../database/entity/coutries";
import { groupes } from "../database/entity/groupes";
import { competitions } from '../database/entity/competitions';

const groupsRouter = express.Router();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }


groupsRouter.post('/create-groups/:compet', async (req, res) => {
    try  {
        let competion = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.compet)})

        await AppDataSource.getRepository(groupes).delete({competition:competion})

        let countriesList = await AppDataSource.getRepository(countries).find();

        let groupsList = ['A','B','C','D','E','F']
        let newGroups = []
        let hat = [1,2,3,4];


        // Parcourir chaque groupe et attribuer les pays
        for (let group of groupsList) {
            // Créer une nouvelle instance de groupe
            let newGroup = new groupes();
            newGroup.groupName = group;
            newGroup.countriesList = [];

            // Parcourir chaque chapeau et attribuer un pays au groupe
            for (let h of hat) {
                // Filtrer les pays du chapeau h
                let countriesOfHatH = countriesList.filter((c) => c.hat === h);

                // Choisir un pays aléatoirement
                let choosenCountry = countriesOfHatH[getRandomInt(0, countriesOfHatH.length - 1)];

                // Retirer le pays choisi de la liste des pays
                countriesList = countriesList.filter((c) => c.id !== choosenCountry.id);

                // Ajouter le pays au groupe
                newGroup.countriesList.push(choosenCountry);
            }

            // Sauvegarder le groupe dans la base de données
            newGroup.competition = competion
            newGroups.push(newGroup)
            await AppDataSource.getRepository(groupes).save(newGroup);
        }

        return res.send(newGroups)

    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
});

groupsRouter.get('/:compet', async (req,res)=>{
    try {
        let competion = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.compet)})

        let groups = await AppDataSource.getRepository(groupes).find({
            relations: {
                countriesList: true
            },
            where: {
                competition: competion
            }
        })
        
        res.send(groups)
    } catch (e) {
        res.sendStatus(500)
    }
});

export { groupsRouter }