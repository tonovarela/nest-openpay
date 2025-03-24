import { IsString, IsNumber, Length, IsNotEmpty, Matches, Min, Max } from 'class-validator';

export class RegisterCardDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'First name must contain only letters and spaces' })
    first_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name must contain only letters and spaces' })
    last_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Second last name is required' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Second last name must contain only letters and spaces' })
    last_name2: string;

    @IsString()
    @IsNotEmpty({ message: 'Card number is required' })
    @Length(16, 16, { message: 'Card number must be 16 digits long' })
    @Matches(/^[0-9]+$/, { message: 'Card number must contain only numbers' })
    card_number: string;

    @IsString()
    @IsNotEmpty({ message: 'Expiration month is required' })
    @Length(2, 2, { message: 'Expiration month must be 2 digits long' })
    @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Invalid month (01-12)' })
    expiration_month: string;

    @IsString()
    @IsNotEmpty({ message: 'Expiration year is required' })
    @Length(2, 2, { message: 'Expiration year must be 2 digits long' })    
    expiration_year: string;

    @IsString()
    @IsNotEmpty({ message: 'CVV is required' })    
    cvv2: number;
}