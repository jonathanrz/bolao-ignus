import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm"

import { Match } from "./Match"

@Entity()
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() team1Score: number
  @Column() team2Score: number

  @ManyToOne(type => Match, { eager: true })
  match: Match
}
