import { matches } from "../database/entity/matches";
import { TeamScore } from "./getWinners";

export function getWinnersOfQualif(matchs:matches[]):TeamScore[] {
    let teamScores = {} as TeamScore[];

    // Parcourir chaque match pour calculer les scores
    for (let match of matchs) {
        let homeTeam = match.homeTeam.id;
        let awayTeam = match.awayTeam.id;

        // Initialiser les scores si nécessaire
        if (!teamScores[homeTeam]) {
            teamScores[homeTeam] = { wins: 0, goals: 0 , info: match.homeTeam, match };
        }
        if (!teamScores[awayTeam]) {
            teamScores[awayTeam] = { wins: 0, goals: 0, info: match.awayTeam, match };
        }

        // Mettre à jour les scores en fonction des résultats du match
        if (match.result === 'win') {
            teamScores[homeTeam].wins++;
            teamScores[homeTeam].goals += match.homeTeamGoals;
            teamScores[awayTeam].goals += match.awayTeamGoals;
        } else if (match.result === 'loss') {
            teamScores[awayTeam].wins++;
            teamScores[homeTeam].goals += match.homeTeamGoals;
            teamScores[awayTeam].goals += match.awayTeamGoals;
        } else { // match nul
            teamScores[homeTeam].goals += match.homeTeamGoals;
            teamScores[awayTeam].goals += match.awayTeamGoals;
        }
    }

    // Trier les équipes par nombre de victoires et de buts pour déterminer les équipes qualifiées
    let qualifiedTeams = Object.values(teamScores).sort((a:TeamScore, b:TeamScore) => {
        if (a.wins > b.wins) {
            return -1;
        } else if (a.wins < b.wins) {
            return 1;
        } else { // Si le nombre de victoires est le même, utiliser la différence de buts
            return b.goals - a.goals;
        }
    }).slice(0, 16); 

    
    return qualifiedTeams
}