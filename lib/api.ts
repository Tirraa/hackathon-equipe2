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

export interface EnergieRecommendation {
  energieSolaire: {
    puissance: number;
    tauxRecommandation: number;
  };
  energieEolienne: {
    puissance: number;
    tauxRecommandation: number;
  };
  message: string;
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

      const products: ApiProduct[] = await response.json();

      return products;
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },
};

export const weatherService = {
  async getAllRecommendations(
    loc: EnergyRecommendationsProps
  ): Promise<EnergieRecommendation> {
    const url = new URL(`${API_BASE_URL}/weather/power/recommendation`);
    url.searchParams.append("lat", loc.lat.toString());
    url.searchParams.append("lng", loc.lng.toString());

    try {
      const response = await fetch(url.toString());

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des recommendations");

      const recommendations: EnergieRecommendation = await response.json();
      return recommendations;
    } catch (error) {
      console.error("Erreur API:", error);
      return {} as any;
    }
  },
};
