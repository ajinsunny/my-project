import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Goal } from '../../goal/entities/goal.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  monthlyIncome: number;

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];
}
