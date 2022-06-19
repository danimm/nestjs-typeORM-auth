import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from '../../products/services/products.service';

import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private customersService: CustomersService,
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject('PG') private client: Client,
  ) {}

  findAll() {
    return this.usersRepository.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.usersRepository.create(data);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    if (data.customerId) {
      newUser.customer = await this.customersService.findOne(data.customerId);
    }
    return this.usersRepository.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);
    this.usersRepository.merge(user, changes);
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async getOrderByUSer(id: number) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  getTasks(): Promise<{ id: number; title: string; completed: boolean }[]> {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM tasks', (err, res) => {
        if (err) reject(err);
        else resolve(res.rows);
      });
    });
  }
}
