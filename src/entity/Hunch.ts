import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm"

import { Match } from "./Match"
import { User } from "./User"

@Entity()
export class Hunch extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() team1Score: number
  @Column() team2Score: number

  @ManyToOne(type => Match, { eager: true })
  match: Match
  @ManyToOne(type => User, { eager: true })
  user: User
}
