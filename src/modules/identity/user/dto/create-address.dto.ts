import { IsString } from "class-validator";

export class CreateAddressDto {
  @IsString()
  fullName!: string;
  phone!: string;
  country!: string;
  division!: string;
  district!: string;
  addressLine!: string;
  isDefault?: boolean;
}
