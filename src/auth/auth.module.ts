import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard'; // 👈 importa el guard

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET')!,
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN')! },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard], // 👈 declara el guard como provider
  exports: [JwtModule, AuthService, JwtAuthGuard], // 👈 expórtalo también
})
export class AuthModule {}
