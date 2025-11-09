import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Orcamento } from './Orcamento';

@Entity('cotacoes')
export class Cotacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Orcamento, (orcamento) => orcamento.cotacoes)
  @JoinColumn({ name: 'orcamento_id' })
  orcamento!: Orcamento;

  @Column()
  fornecedor!: string;

  @Column({ type: 'real' })
  valorUnitario!: number;

  @Column({ type: 'real' })
  valorTotal!: number;

  @Column()
  prazoEntrega!: string;

  @Column('text')
  condicoes!: string;

  @Column({ type: 'real' })
  avaliacao!: number;

  @Column()
  status!: string;
}

