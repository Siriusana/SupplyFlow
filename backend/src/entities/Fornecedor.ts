import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fornecedores')
export class Fornecedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  cnpj!: string;

  @Column()
  email!: string;

  @Column()
  telefone!: string;

  @Column()
  endereco!: string;

  @Column()
  categoria!: string;

  @Column({ type: 'real' })
  avaliacao!: number;

  @Column()
  status!: string;

  @Column({ type: 'integer', default: 0 })
  totalPedidos!: number;
}

