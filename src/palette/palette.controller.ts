import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PaletteService } from './palette.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('palette')
export class PaletteController {
  constructor(private readonly paletteService: PaletteService) {}

  // ✅ POST /api/palette → guarda análisis IA en la tabla ia_results
  @Post()
  async saveResult(@Body() body: any) {
    try {
      const result = await this.paletteService.saveResult(body);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Resultado de IA guardado correctamente en la tabla ia_results',
        result,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error.message || 'Error al guardar resultado en la tabla ia_results',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
