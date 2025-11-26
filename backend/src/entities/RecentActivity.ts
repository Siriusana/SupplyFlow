import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recent_activities')
export class RecentActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  type!: string;

  @Column()
  time!: string;

  @Column()
  icon!: string;

  @Column()
  color!: string;
}

