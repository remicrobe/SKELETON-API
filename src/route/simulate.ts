import * as express from 'express'
import { AppDataSource } from '../database/datasource';
import { groupes } from '../database/entity/groupes';
import { matches } from '../database/entity/matches';
import { competitions } from '../database/entity/competitions';
import { ErrorHandler } from '../utils/error/error-handler';
import { simulateRound } from '../utils/simulateRouds';
import { getWinners } from '../utils/getWinners';
import { getWinnersOfQualif } from '../utils/getWinnersOfQualif';


const simulateRouter = express.Router();


simulateRouter.post('/generate/:compet/:level', async (req, res) => {
    try {
        let competition = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.compet)})

        // level: number; // '99', '16', '4', '2', '1'
        let level = [ 99, 16 , 4 , 2 , 1 ]
        let selectedLevel = parseInt(req.params.level)
        let selectedLevelIndex = level.findIndex(l => l === selectedLevel);

        if(selectedLevelIndex === -1) {
            return res.status(422).send('Quelle niveau de la compétition voulez vous simuler')
        }
        
        let previousMatches;
        if(level[selectedLevelIndex] !== 99) {
            previousMatches = await AppDataSource.getRepository(matches).find({
                where: {
                    level: level[selectedLevelIndex-1],
                    competion: competition
                }, 
                relations: {
                    awayTeam: true,
                    homeTeam: true
                }
            })
            if(!previousMatches) {
                return res.status(422).send('Le précédent niveau de la compétition n\'as pas eut lieu')
            }
        }
        let actualMatches = await AppDataSource.getRepository(matches).findOne({
            where: {
                level: level[selectedLevelIndex],
                competion: competition
            }
        })

        if(actualMatches) {
            return res.status(422).send('Ce niveau de la compétition a déjà été joué')
        }

        let matchs = []

        if(level[selectedLevelIndex] === 99) {

            // Récupérer tous les groupes avec leurs pays respectifs
            let groups = await AppDataSource.getRepository(groupes).find({
                relations: {
                    countriesList: true
                },
                where: {
                    competition: competition
                }
            });
            if(!groups) {
                return res.status(422).send('Les groupes n\'ont pas été créé pour cette compétition')
            }

            // Parcourir chaque groupe et simuler la phase de groupe
            for (let group of groups) {
                let countries = group.countriesList;
                for (let i = 0; i < countries.length; i++) {
                    for (let j = i + 1; j < countries.length; j++) {
                        
                        // Créer une nouvelle instance de match
                        let match = new matches();
                        match.homeTeam = countries[i];
                        match.awayTeam = countries[j];

                        // Simuler le match entre countries[i] et countries[j]
                        match.homeTeamGoals = Math.floor(Math.random() * 5);
                        match.awayTeamGoals = Math.floor(Math.random() * 5);

                        if (match.homeTeamGoals > match.awayTeamGoals) {
                            match.result = 'win';
                        } else if (match.homeTeamGoals < match.awayTeamGoals) {
                            match.result = 'loss';
                        } else {
                            match.result = 'draw';
                        }

                        matchs.push(match)

                        // Sauvegarder le résultat dans la base de données
                        match.level = parseInt(req.params.level)
                        match.competion = competition;
                        await AppDataSource.getRepository(matches).save(match);
                    }
                }
            
            }
            return res.send(getWinnersOfQualif(matchs))

            
        } else if(level[selectedLevelIndex] === 16) { // 
            // Dans le cas ou on est en 16 ème de finale la situation est assez spéciale car nous devons 
            // effectuer des calcules plus ou moins précis pour connaitre qui est qualifié
           
            return res.send(getWinners(await simulateRound(getWinnersOfQualif(previousMatches).map((teams=> teams.info)), competition, level[selectedLevelIndex])))
        } else {
            let winners = getWinners(previousMatches)
            return res.send(getWinners(await simulateRound(winners.map((teams=> teams.info)), competition, level[selectedLevelIndex])))
        }

    } catch (e) {
        return ErrorHandler(e,req,res)
    }
});

simulateRouter.get('/view-result/:compet/:level', async (req, res) => {
    try {
        let competition = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.compet)})

        // level: number; // '99', '16', '4', '2', '1'
        let level = [ 99, 16 , 4 , 2 , 1 ]
        let selectedLevel = parseInt(req.params.level)
        let selectedLevelIndex = level.findIndex(l => l === selectedLevel);

        if(selectedLevelIndex === -1) {
            return res.status(422).send('Quelle niveau de la compétition voulez vous visualiser')
        }
        
        let previousMatches = await AppDataSource.getRepository(matches).find({
            where: {
                level: level[selectedLevelIndex],
                competion: competition,
            },
            relations: {
                awayTeam: true,
                homeTeam: true,
            }
        })

        if(level[selectedLevelIndex] === 99) { // 
            // Dans le cas ou on est en 16 ème de finale la situation est assez spéciale car nous devons 
            // effectuer des calcules plus ou moins précis pour connaitre qui est qualifié
            
            return res.send(getWinners(previousMatches))

        } else {
            return res.send(getWinners(previousMatches))
        }

       // return res.send(matchs)
    } catch (e) {
        return ErrorHandler(e,req,res)
    }
});

simulateRouter.get('/view-matches/:compet/:level', async (req, res) => {
    try {
        let competition = await AppDataSource.getRepository(competitions).findOneByOrFail({id:parseInt(req.params.compet)})

        // level: number; // '99', '16', '4', '2', '1'
        let level = [ 99, 16 , 4 , 2 , 1 ]
        let selectedLevel = parseInt(req.params.level)
        let selectedLevelIndex = level.findIndex(l => l === selectedLevel);

        if(selectedLevelIndex === -1) {
            return res.status(422).send('Quelle niveau de la compétition voulez vous visualiser')
        }
        
        let matchs = await AppDataSource.getRepository(matches).find({
            where: {
                level: level[selectedLevelIndex],
                competion: competition,
            },
            relations: {
                awayTeam: true,
                homeTeam: true,
            }
        })

       return res.send(matchs)
    } catch (e) {
        return ErrorHandler(e,req,res)
    }
});





export { simulateRouter }
