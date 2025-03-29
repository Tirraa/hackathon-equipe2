export enum ProductType {
    SOLAR,
    WIND
}

export class productData {
    label: string;
    recommended: string;
    production: string;
    maintenance: string;
    price: string;
    link: string;
    nbBlades?: string; // Rayon des pales en mètres M
    sfPanel?: string; // Surface des panneaux solaires en m² 
    type: ProductType;
}