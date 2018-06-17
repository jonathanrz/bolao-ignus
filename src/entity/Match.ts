import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm"

import { Team } from "./Team"

@Entity()
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() date: number

  @ManyToOne(type => Team, { eager: true })
  team1: Team
  @ManyToOne(type => Team, { eager: true })
  team2: Team
}
