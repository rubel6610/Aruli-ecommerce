import { Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findOne(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new User({
      id: Math.random().toString(36).substring(2, 9),
      email: user.email,
      name: user.name,
      role: user.role || 'customer',
      createdAt: new Date(),
    });
    this.users.push(newUser);
    return newUser;
  }
}
