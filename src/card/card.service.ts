import { HttpException, HttpStatus, Injectable, Logger, StreamableFile } from '@nestjs/common';
import { RegisterCardDto } from './dtos';
import axios from 'axios';
import { ResponseToken, ResponseTokenCard } from './interfaces/response-token-card.interface';
import { PrismaService } from 'src/prisma/prisma.service';
// import * as fs from 'fs';
// import * as path from 'path';
// import { first, last } from 'rxjs';
// import { Card } from '@prisma/client';


@Injectable()
export class CardService {
    private readonly logger = new Logger(CardService.name);

    private readonly merchantId: string;
    private readonly publicKey: string;
    private readonly urlOpenPay: string;

    constructor(private readonly prisma: PrismaService,) {
        this.merchantId = process.env.MERCHANT_ID;
        this.publicKey = process.env.PUBLIC_KEY;
        this.urlOpenPay = process.env.URL_OPENPAY;

        if (!this.merchantId || !this.publicKey || !this.urlOpenPay) {
            throw new Error('Variables de entorno faltantes para OpenPay');
        }
    }

    async add(registerCardDto: RegisterCardDto) {
        try {            
            await this.validateExistingCard(registerCardDto);
            const tokenResponse = await this.createCardInOpenPay(registerCardDto);
            return await this.saveCard(registerCardDto, tokenResponse);
        } catch (error) {
            this.handleError(error);
        }
    }







    async list() {
        const cards = await this.prisma.card.findMany({
            select: {
                id: true,
                number: true,
                token: true,
                brand: true,
                type: true,
                first_name: true,
                last_name: true,
                last_name2: true,
                year_expiration: true,
                month_expiration: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        return {
            cards: cards.map(card => ({
                ...card,
                number: `##########${card.number.slice(-3)}` // Muestra solo los últimos 3 dígitos
            }))
        };
    }





    async generateTextFile()
    //:Promise<StreamableFile>
    {
        const cards = await this.prisma.card.findMany({
            select: {
                id: true,
                number: true,
                year_expiration: true,
                token: true,
                first_name: true,
                last_name: true,
                month_expiration: true
            },
            orderBy: {
                id: 'desc'
            },
            take: 10           
        });

        let content = cards.map((card, index) => {
            const indice = `00${(index + 1)}`.slice(-3);
            return `DTL|${indice}|Orden-${indice}|${card.token}|20.00|MX|Cobro de servicio de ${card.first_name} ${card.last_name}|${card.first_name}|${card.last_name}|| `
        })
            .join('\n');

        content = `${content}\nTRL|${`00${(cards.length + 1)}`.slice(-3)}|${`00${(cards.length)}`.slice(-3)}`;
        //const fileName = `cards_${new Date().toISOString().split('T')[0]}.txt`;
        //const filePath = path.join(process.cwd(), 'temp', fileName);

        // Asegurarse que el directorio existe
        // if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
        //     fs.mkdirSync(path.join(process.cwd(), 'temp'));
        // }

        // fs.writeFileSync(filePath, content);
        // const file = fs.createReadStream(filePath);

        //return new StreamableFile(file);
        return content;
    }


    private async validateExistingCard(cardData: RegisterCardDto): Promise<void> {
        const cardDB = await this.prisma.card.findFirst({
            where: {
                AND: [
                    { number: cardData.card_number },
                    { year_expiration: cardData.expiration_year },
                    { month_expiration: cardData.expiration_month },
                    { active: true }
                ]
            }
        });

        if (cardDB) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error',
                details: 'La tarjeta ya existe'
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private async createCardInOpenPay(cardData: RegisterCardDto): Promise<ResponseTokenCard> {
        const url = `${this.urlOpenPay}/${this.merchantId}/tokens`;
        const auth = Buffer.from(`${this.publicKey}:`).toString('base64');
        try {
            const response = await axios.post<ResponseToken>(url, {...cardData,holder_name:`${cardData.first_name} ${cardData.last_name}`}, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            const { id, card } = response.data;
            return {
                error: null,
                cardWithToken: {
                    token: id,
                    brand: card.brand,
                    type: card.type
                }
            };
        } catch (error) {
            this.logger.error(`Error OpenPay: ${JSON.stringify(error.response?.data)}`);
            return { error: error.response?.data, cardWithToken: null };
        }
    }

    private async saveCard(cardData: RegisterCardDto, tokenResponse: ResponseTokenCard) {
        if (tokenResponse.error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error OpenPay',
                details: tokenResponse.error.description
            }, HttpStatus.BAD_REQUEST);
        }
        const newCard = {
            number: cardData.card_number,
            first_name: cardData.first_name,
            last_name: cardData.last_name,
            last_name2: cardData.last_name2,
            token: tokenResponse.cardWithToken.token,
            brand: tokenResponse.cardWithToken.brand,
            type: tokenResponse.cardWithToken.type,
            year_expiration: cardData.expiration_year,
            month_expiration: cardData.expiration_month,
        };
        await this.prisma.card.create({ data: newCard });
        return { message: 'Tarjeta guardada' };
    }

    private handleError(error: any) {
        this.logger.error(error);
        if (error instanceof HttpException) {
            throw error;
        }

        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error',
            details: 'Error interno del servidor'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}