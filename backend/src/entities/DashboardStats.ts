import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dashboard_stats')
export class DashboardStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  value!: string;

  @Column()
  change!: string;

  @Column()
  trend!: string;

  @Column()
  icon!: string;

  @Column()
  color!: string;
}

