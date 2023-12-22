import { AppDataSource } from "../database/datasource";
import { competitions } from "../database/entity/competitions";
import { countries } from "../database/entity/coutries";
import { matches } from "../database/entity/matches";


export async function simulateRound(teams: countries[], competition: competitions, level) {
    let matchs: matches[] = [];

    // Apparier les équipes pour ce tour
    for (let i = 0; i < teams.length; i += 2) {
        let match = new matches();
        match.homeTeam = teams[i];
        match.awayTeam = teams[i + 1];

        // Simuler le match
        match.homeTeamGoals = Math.floor(Math.random() * 5);
        match.awayTeamGoals = Math.floor(Math.random() * 5);

        if (match.homeTeamGoals > match.awayTeamGoals) {
            match.result = 'win';
        } else if (match.homeTeamGoals < match.awayTeamGoals) {
            match.result = 'loss';
        } else { // En cas de match nul, choisir un gagnant au hasard
            match.result = Math.random() < 0.5 ? 'win' : 'loss';
        }

        // Sauvegarder le résultat dans la base de données
        match.level = level;
        match.competion = competition;
        matchs.push(match)
        await AppDataSource.getRepository(matches).save(match);
    }

    return matchs;
}