import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { countries } from "./coutries";
import { competitions } from "./competitions";

@Entity()
export class groupes {
    @PrimaryGeneratedColumn()
    groupId: number;

    @Column()
    groupName: string;

    @ManyToMany(()=> countries)
    @JoinTable()
    countriesList: countries[]

    @ManyToOne(() => competitions, (c) => c.groupesList)
    competition: competitions
}