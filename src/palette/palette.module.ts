import { Module } from '@nestjs/common';
import { PaletteController } from './palette.controller';
import { PaletteService } from './palette.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [PaletteController],
  providers: [PaletteService],
})
export class PaletteModule {}
