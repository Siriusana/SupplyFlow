import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Negociacao } from './Negociacao';

@Entity('historico_negociacao')
export class HistoricoNegociacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Negociacao, (negociacao) => negociacao.historico)
  @JoinColumn({ name: 'negociacao_id' })
  negociacao!: Negociacao;

  @Column({ type: 'date' })
  data!: string;

  @Column()
  autor!: string;

  @Column('text')
  mensagem!: string;

  @Column({ type: 'real' })
  valor!: number;
}

