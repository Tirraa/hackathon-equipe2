export enum ProductType {
    SOLAR,
    WIND
}

export class Product {
    id: number;
    label: string;
    recommended?: string;
    production?: number;
    maintenance?: string;
    image: string;
    price: number;
    link: string;
    nbBlades?: number; // Rayon des pales en mètres M
    sfPanel?: number; // Surface des panneaux solaires en m² 
    type: ProductType;
}