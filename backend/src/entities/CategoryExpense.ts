import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('category_expenses')
export class CategoryExpense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'real' })
  valor!: number;
}

