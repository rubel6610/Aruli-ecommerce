import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [AuthModule, UserModule, SellerModule, RbacModule],
  exports: [AuthModule, UserModule, SellerModule, RbacModule],
})
export class IdentityModule {}
