import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column()
  role!: string; // ADMIN, USER

  @Column({ type: 'integer', default: 1 })
  active!: number; // 1 = true, 0 = false (SQLite doesn't have native Boolean)
}

