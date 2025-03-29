import { Product, ProductType } from "../models/ProductData";

export const productsList: Product[] = [
    {
        id: 1,
        label: "Panneau Solaire 100W",
        price: "48,90€",
        link: "https://www.amazon.fr/Flexibles-Portables-conviennent-générateurs-extérieurs/dp/B09LCN1NYN/ref=sr_1_7?__mk_fr_FR=ÅMÅŽÕÑ&crid=36ALZ2W7FE5KX&dib=eyJ2IjoiMSJ9.2OVk8OtuorKlyrYn3_-RFE5sr4yuu2U_yx7dHwS5cdmTxXOsapf594iFowagWSJ7YvvZZ018eU2TRTn7TueLA1aYlopQU4bM1nuRbJOfFQ_XXMi2lUkWCbSQUtjWqZw3d0esSnclHCHepRowij0Xb0y0eQOZXqE2Lebl_jpMa7JFiAPpHIsgOWqXzx_mBGJQFE9JlkNkx7_gItf8dCXzYRkOsjJ0-sH8Gye0CC98GhzWEIVbLuKjlkzrqKGOgZWYPZvpdP8xTZ1AiuxuCfay-ESPlVQGTYMep8_EC2J1Jkkm24SEp3yMvEtLtATTFIW256nQBsfvlxfMPGWl00K73qCimVH3mSglvfm1e2IDeBdLR2YN3TbeU0LQlXhr0VomJVUrHwWDmnoNYdiSg5uRKS88dIAOd_4hxw7NMAAT3FeIVVxl5y3DaTBEjOs4RKJK.mkwCBla18F3DU33a4S3xEAAgtfbI_Fqv9ABMtVV714I&dib_tag=se&keywords=un%2Bpanneau%2Bsolaire&qid=1743275247&sprefix=un%2Bpanneau%2Bsolaire%2Caps%2C95&sr=8-7&th=1",
        sfPanel: 0.5,
        type: ProductType.SOLAR,
    },
    {
        id: 2,
        label: "Panneau Solaire 300W",
        price: "$400",
        link: "https://example.com/solar300w",
        sfPanel: 3.5,
        type: ProductType.SOLAR
    },
    {
        id: 3,
        label: "Panneau Solaire 500W",
        price: "$650",
        link: "https://example.com/solar500w",
        sfPanel: 5.5,
        type: ProductType.SOLAR
    },
    {
        id: 4,
        label: "Éolienne 400 W",
        price: "155,77€",
        link: "https://www.amazon.fr/VEVOR-Générateur-contrôleur-automatique-camping-car/dp/B0BKGKNJD9/ref=sr_1_1_sspa?__mk_fr_FR=ÅMÅŽÕÑ&crid=UHDRXG5GE3FS&dib=eyJ2IjoiMSJ9.mJ_8kl1erUcMfBdzESLGDI-vlsxiJ0sCy0GmmfLof3xK6oXsykCpGEgq_eDEZmyYLYdUjWutzrS4Bg7Xf4lKzvjleklY7_UMLasDRh3Oe2CwOR-bOKgIjJl-YkAxsceY7hAPI4-L_MdvMbT-_QsQT6IPKBDy-M3eoTfgLOiwEjuDBo5F1LhiiU7kEKNPyUrVw6nW2ZC0lsQA0wFAD3MUW5trwnMO2w5Qc9WKF6zlC7Eb3EQls90toP0hunY_SaVs7QTGQRzNpauA4u_-STTtrxsDB5Km9kk-vn2GfkbWRZs.uC7vowcnMhUeNed0VdFNdWL9WzgaSncbqTy1ZzWGymw&dib_tag=se&keywords=eolienne&qid=1743276763&sprefix=eolienne+%2Caps%2C95&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
        nbBlades: 1.2,
        type: ProductType.WIND,
    },
    {
        id: 5,
        label: "Éolienne 10kW",
        price: "$10000",
        link: "https://example.com/wind10kw",
        nbBlades: 3,
        type: ProductType.WIND
    },
    {
        id: 6,
        label: "Éolienne 25kW",
        maintenance: "Maintenance semestrielle",
        price: "$25000",
        link: "https://example.com/wind25kw",
        nbBlades: 3,
        type: ProductType.WIND
    }
];