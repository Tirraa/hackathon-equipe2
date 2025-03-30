const API_BASE_URL = "https://hackathon-equipe2.onrender.com";

export interface ApiProduct {
  id: string;
  label: string;
  type: number;
  link: string;
  price: string;
  production: number;
  sfPanel: number;
}

interface EnergyRecommendationsProps {
  lat: number
  lng: number
  name: string
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

      const products: ApiProduct[] = await response.json();
      return products;
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },
};
