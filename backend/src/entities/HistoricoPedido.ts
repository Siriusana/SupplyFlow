import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './Pedido';

@Entity('historico_pedido')
export class HistoricoPedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.historico)
  @JoinColumn({ name: 'pedido_id' })
  pedido!: Pedido;

  @Column({ type: 'date' })
  data!: string;

  @Column()
  status!: string;

  @Column('text')
  descricao!: string;
}

