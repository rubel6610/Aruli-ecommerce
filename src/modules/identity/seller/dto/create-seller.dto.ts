export class CreateSellerDto {
  userId!: string;
  storeName!: string;
  businessEmail!: string;
  businessPhone!: string;
  commissionRate?: number;
}
