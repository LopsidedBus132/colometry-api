import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.get('SUPABASE_URL')!,
      this.config.get('SUPABASE_KEY')!,
    );
  }

  async register(dto: RegisterDto) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: dto.email,
        password: dto.password,
        name: dto.name
      });
      if (error) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      const token = await this.jwtService.signAsync(
        { id: data.user?.id, email: data.user?.email },
        {
          secret: this.config.get('JW_SECRET')!,
          expiresIn: this.config.get('JWT_EXPIRES_IN')!,
        },
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Usuario registrado correctamente',
        user: data.user,
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Hubo un error al registrar al usuario'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });
      if (error) {
        throw new HttpException(
          { statisCode: HttpStatus.UNAUTHORIZED, message: error.message },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const token = await this.jwtService.signAsync(
        { id: data.user?.id, email: data.user?.email },
        {
          secret: this.config.get('JW_SECRET')!,
          expiresIn: this.config.get('JWT_EXPIRES_IN')!,
        },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'inicio de sesión exitoso',
        user: data.user,
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error al iniciar sesión'
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
