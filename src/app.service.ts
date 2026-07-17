import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSystemStatus() {
    return {
      status: 'ok',
      message: 'Aruli Marketplace API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
