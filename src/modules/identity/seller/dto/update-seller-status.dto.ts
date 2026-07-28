import { SellerStatus } from '@prisma/client';

export class UpdateSellerStatusDto {
  status!: SellerStatus;
  approvedById?: string;
}
