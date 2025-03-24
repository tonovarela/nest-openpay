import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),
    CardModule,
     SeedModule,
     PrismaModule,
     AuthModule, 
  ],
  
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer) {    
    consumer.apply(JwtMiddleware).forRoutes('card');
  }
}
