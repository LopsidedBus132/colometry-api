import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { PaletteModule } from './palette/palette.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 carga .env automáticamente
    AuthModule,
    AnalyzeModule,
    PaletteModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
