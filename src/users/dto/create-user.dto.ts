import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty()
  password: string;
  phone?: number;
  age?: number;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
