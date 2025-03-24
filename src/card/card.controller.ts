import { Body, Controller, Get, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { RegisterCardDto } from './dtos';


@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  

  @Post()
  async add(@Body() registerCardDto: RegisterCardDto) {
    return this.cardService.add(registerCardDto);
  }

  @Get('')
  async list() {
    return this.cardService.list();
  }


  @Get('generate')
  async generate() {
    return this.cardService.generateTextFile();
  }


}
