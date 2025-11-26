import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HistoricoNegociacao } from './HistoricoNegociacao';

@Entity('negociacoes')
export class Negociacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  item!: string;

  @Column()
  fornecedor!: string;

  @Column({ type: 'real' })
  valorInicial!: number;

  @Column({ type: 'real' })
  valorNegociado!: number;

  @Column()
  desconto!: string;

  @Column()
  responsavel!: string;

  @Column({ type: 'date' })
  dataInicio!: string;

  @Column({ type: 'date', nullable: true })
  dataFim?: string;

  @Column()
  status!: string;

  @OneToMany(() => HistoricoNegociacao, (historico) => historico.negociacao)
  historico!: HistoricoNegociacao[];
}

