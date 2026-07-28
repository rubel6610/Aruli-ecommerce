import { IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  country!: string;

  @IsString()
  division!: string;

  @IsString()
  district!: string;

  @IsString()
  addressLine!: string;

  @IsString()
  isDefault?: boolean;
}
