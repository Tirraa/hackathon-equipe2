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