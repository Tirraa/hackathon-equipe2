const API_BASE_URL = "https://hackathon-equipe2.onrender.com";

export interface ApiProduct {
  id: string;
  label: string;
  type: number;
  link: string;
  price: number;
  image: string;
  production: number;
  sfPanel: number;
}

interface EnergyRecommendationsProps {
  lat: number;
  lng: number;
  name: string;
}

export const productService = {
  /**
   * Récupère tous les produits
   */
  async getAllProducts(loc: EnergyRecommendationsProps): Promise<ApiProduct[]> {
    const url = new URL(`${API_BASE_URL}/product`);
    url.searchParams.append("lat", loc.lat.toString());
    url.searchParams.append("lng", loc.lng.toString());

    try {
      const response = await fetch(url.toString());

      if (!response.ok) throw new Error("Erreur lors du fetch des produits");

      var products: ApiProduct[] = await response.json();
      products = products.map((el) => {
        el.price = 12;
        el.image =
          "https://m.media-amazon.com/images/I/41v1B-bkQML._SY445_SX342_QL70_ML2_.jpg";
        return el;
      });

      return products;
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },
};
