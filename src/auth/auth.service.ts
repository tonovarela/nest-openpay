import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { PrismaService } from '../prisma/prisma.service';
interface PayLoadOptions {
   id,
    email    

}
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,private prismaService:PrismaService) {}
    

    private async generateToken(payload:PayLoadOptions): Promise<string> {        
        const token =await this.jwtService.signAsync(payload);
        return token;            
    }

    
    async login(loginDto: LoginDto) {        
        const {email,password} = loginDto;
        const usersDB =await this.prismaService.user.findMany({});
        console.log(usersDB);
        const userDB =await this.prismaService.user.findFirst({
            where:{
                AND:[{email},
                     {password}
                    ]   
            }
        });
        if (!userDB){
            throw new HttpException('Usuario o contraseña incorrectos',HttpStatus.UNAUTHORIZED);
        }
        const token= await this.generateToken({id:userDB.id,email:userDB.email});
        return {token};

    }

}
