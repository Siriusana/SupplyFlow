import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HistoricoPedido } from './HistoricoPedido';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  item!: string;

  @Column()
  fornecedor!: string;

  @Column({ type: 'integer' })
  quantidade!: number;

  @Column({ type: 'real' })
  valor!: number;

  @Column({ type: 'date' })
  dataPedido!: string;

  @Column({ type: 'date' })
  dataEntrega!: string;

  @Column()
  endereco!: string;

  @Column()
  rastreio!: string;

  @Column()
  requisicaoCodigo!: string;

  @Column()
  status!: string;

  @OneToMany(() => HistoricoPedido, (historico) => historico.pedido)
  historico!: HistoricoPedido[];
}

