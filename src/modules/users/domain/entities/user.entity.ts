export class User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'vendor' | 'admin';
  createdAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
