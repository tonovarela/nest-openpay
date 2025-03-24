import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService,
                private prismaService:PrismaService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            const token = authHeader.split(' ')[1];
            const decoded = await this.jwtService.verifyAsync(token);            
            const {id,email} = decoded;
            const userDB =await this.prismaService.user.findFirst({
                where:{
                    AND:[{id},
                         {email},
                         {active:true}
                        ]
                }
            });
            if (!userDB){
                throw new UnauthorizedException('Invalid token');
            } 
            req['user'] = decoded;            
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}