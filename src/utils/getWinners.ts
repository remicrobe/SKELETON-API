import { countries } from "../database/entity/coutries";
import { matches } from "../database/entity/matches";

export interface TeamScore {
    wins: number;
    goals: number;
    info: countries;
    match: matches
}

export function getWinners(matchs:matches[]) {
    let winners = [] as TeamScore[]

    for (let match of matchs) {
        // Initialiser les scores si nécessaire

        if(match.result === 'win') {
            winners.push({ wins: 1, goals: match.homeTeamGoals , info: match.homeTeam, match })
        } else {
            winners.push({ wins: 1, goals: match.awayTeamGoals , info: match.homeTeam, match })
        }
    }

    return winners

}