import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { groupes } from "./groupes";
import { matches } from "./matches";

@Entity({synchronize: true})
export class competitions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => groupes, (g) => g.competition)
    groupesList: groupes[]

    @OneToMany(() => matches, (m) => m.competion)
    matchesList: matches[]

}