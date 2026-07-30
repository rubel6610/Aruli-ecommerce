import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System status payload.' })
  @Get()
  getSystemStatus() {
    return this.appService.getSystemStatus();
  }
}
