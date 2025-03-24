import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeedService {

    constructor(private prismaService: PrismaService) { }
    async seedData() {
        await this.prismaService.card.deleteMany({});
        for (let i = 0; i < 100; i++) {
            const uid = crypto.randomUUID();
            await this.prismaService.card.create({
                data: {
                    number: faker.finance.creditCardNumber('################'),
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName(),
                    last_name2: faker.person.lastName(),
                    token: faker.string.alphanumeric(20),
                    brand: 'visa',
                    type: 'credit',
                    year_expiration: `${faker.date.future().getFullYear()}`.padStart(2, '0'),
                    month_expiration: String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0')
                }
            });
        }

        await this.prismaService.user.deleteMany({});
        await this.prismaService.user.create({
            data: {
                email: 'tonovarela@live.com',
                password: "123456789*/",
                active: true,
            }

        });
        return { message: 'Data seeded' };
    }

}
