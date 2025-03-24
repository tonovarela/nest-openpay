import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtMiddleware],
  exports: [JwtModule],
  imports: [ PrismaModule,
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
    })
})]

  
})
export class AuthModule {}
