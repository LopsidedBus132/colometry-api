import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: '🚀 Backend funcionando correctamente!',
      timestamp: new Date().toISOString(),
    };
  }
}
