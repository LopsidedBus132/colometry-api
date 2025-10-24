import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyzeService {
  constructor(private readonly config: ConfigService) {}

  async analyze(file: Express.Multer.File) {
    try {
      const url = this.config.get('N8N_WEBHOOK_URL');
      if (!url) {
        throw new Error('Falta la variable N8N_WEBHOOK_URL en el .env');
      }

      // 👇 Crear objeto form-data para enviar la imagen como binary
      const form = new FormData();
      form.append('image', file.buffer, file.originalname);

      // 👇 Enviar al webhook de n8n (tipo multipart/form-data)
      const response = await axios.post(url, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });

      if (!response.data) {
        throw new Error('n8n no devolvió respuesta');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Error en analyze():', error.message);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error.message || 'Error al enviar la imagen binaria a n8n',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
