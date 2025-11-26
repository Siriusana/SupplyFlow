import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('monthly_expenses')
export class MonthlyExpense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'real' })
  valor!: number;

  @Column({ type: 'real', nullable: true })
  meta?: number;
}

