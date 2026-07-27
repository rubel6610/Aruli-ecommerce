import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { IdentityModule } from './modules/identity/identity.module';

@Module({
  imports: [PrismaModule, IdentityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

