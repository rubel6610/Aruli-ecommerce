import { SellerStatus } from '../../../../../prisma/generated';

export class UpdateSellerStatusDto {
  status!: SellerStatus;
  approvedById?: string;
}
