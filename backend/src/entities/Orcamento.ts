import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cotacao } from './Cotacao';

@Entity('orcamentos')
export class Orcamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  codigo!: string;

  @Column()
  item!: string;

  @Column()
  requisicaoCodigo!: string;

  @Column({ type: 'integer' })
  quantidade!: number;

  @Column({ type: 'date' })
  dataLimite!: string;

  @Column()
  status!: string;

  @OneToMany(() => Cotacao, (cotacao) => cotacao.orcamento)
  cotacoes!: Cotacao[];
}

