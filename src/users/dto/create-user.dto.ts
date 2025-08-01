export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: number;
  age?: number;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
