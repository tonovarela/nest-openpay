export interface ResponseTokenCard {
    error?: {
        code: string;
        description: string;
    } ,
    cardWithToken?: {
        token: string;
        brand: string;
        type: string;    
    }
}


export interface  ResponseToken {
    id:   string;
    card: CardWithToken;
}

export interface CardWithToken {
    card_number:      string;
    holder_name:      string;
    expiration_year:  string;
    expiration_month: string;
    address:          null;
    creation_date:    null;
    brand:            string;
    type:             string;
}
