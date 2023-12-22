import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { groupes } from "./groupes";

@Entity({synchronize: false})
export class countries {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    primary_color: string;

    @Column()
    secondary_color: string;

    @Column()
    fifa_rank: number;

    @Column()
    code: string

    @Column()
    hat: number

    @Column()
    playoff: string

    @ManyToOne(() => groupes, (g) => g.countriesList)
    group: groupes

}