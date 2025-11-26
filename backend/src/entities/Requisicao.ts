import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('requisicoes')
export class Requisicao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  titulo!: string;

  @Column('text')
  descricao!: string;

  @Column()
  solicitante!: string;

  @Column()
  departamento!: string;

  @Column()
  categoria!: string;

  @Column({ type: 'real' })
  valor!: number;

  @Column({ type: 'date' })
  data!: string;

  @Column()
  status!: string;

  @Column()
  prioridade!: string;
}

