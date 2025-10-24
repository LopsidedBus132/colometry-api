import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Validación global (limpia propiedades no permitidas)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ Configuración del CORS
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://colormetry-front.vercel.app'] // dominio de producción
      : ['http://localhost:5173', 'http://localhost:3000']; // dominios locales

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // necesario si usas JWT o cookies
  });

  // Escuchar puerto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}/api`);
}
bootstrap();
