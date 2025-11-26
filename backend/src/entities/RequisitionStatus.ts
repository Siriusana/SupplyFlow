import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('requisition_status')
export class RequisitionStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'integer' })
  value!: number;
}

