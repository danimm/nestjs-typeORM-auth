import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Customer } from './customer.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne((type) => Customer, (customer) => customer.user, { nullable: true })
  @JoinColumn()
  customer: Customer;
}
