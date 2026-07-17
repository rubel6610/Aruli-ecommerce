import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return system health status', () => {
      const response = appController.getSystemStatus();
      expect(response.status).toBe('ok');
      expect(response.message).toContain('Aruli Marketplace API');
      expect(response.timestamp).toBeDefined();
    });
  });
});
