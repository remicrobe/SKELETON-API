import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { countries } from "./coutries";
import { competitions } from "./competitions";

@Entity()
export class matches {
    @PrimaryGeneratedColumn()
    matchId: number;

    @ManyToOne(() => countries)
    homeTeam: countries;

    @ManyToOne(() => countries)
    awayTeam: countries;

    @Column()
    homeTeamGoals: number;

    @Column()
    awayTeamGoals: number;

    @Column()
    result: string; // 'win', 'loss', 'draw'

    @Column()
    level: number; // '16', '4', '2', '1'

    @ManyToOne(() => competitions, (c) => c.matchesList)
    competion: competitions
}
