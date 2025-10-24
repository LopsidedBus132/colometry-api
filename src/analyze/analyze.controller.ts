import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  UseGuards, 
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyzeService } from './analyze.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 👈 importa el guard

@Controller('analyze')
@UseGuards(JwtAuthGuard) // 👈 protege todos los endpoints del controlador
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          StatusCode: HttpStatus.BAD_REQUEST,
          Message : 'No se recibió ningún archivo',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const start = Date.now();
    const result = await this.analyzeService.analyze(file);
    const tiempo_respuesta_ms = Date.now() - start;
    console.log(result);
    return {
      statusCode: HttpStatus.OK,
      message: 'Análisis completado correctamente',
      tiempo_respuesta_ms,
      result,
    };
  }
}
