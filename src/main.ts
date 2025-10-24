import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ CORS correctamente configurado
  app.enableCors({
    origin: [
      'http://localhost:5173',                // frontend local
      'https://colormetry-front.vercel.app',  // frontend en producción
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // si usas JWT o cookies
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`✅ API corriendo en puerto ${process.env.PORT || 3000}`);
}
bootstrap();
