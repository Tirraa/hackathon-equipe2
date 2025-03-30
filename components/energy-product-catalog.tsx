"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type ApiProduct, productService } from "@/lib/api";
import { Input } from "./ui/input";

interface CartItem {
  product: ApiProduct;
  quantity: number;
}

interface EnergyRecommendationsProps {
  lat: number;
  lng: number;
  name: string;
}

interface EnergyProductCatalogProps {
  recommendations: EnergyRecommendationsProps;
}

export default function EnergyProductCatalog({
  recommendations,
}: EnergyProductCatalogProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [energyConsumption, setEnergyConsumption] = useState<number>(2500);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Si une localisation est fournie, récupérer les produits recommandés
        const data = await productService.getAllProducts(recommendations);
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [recommendations]);

  const addToCart = (product: ApiProduct) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      );
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.product.id !== productId);
      }
    });
  };

  const getProductQuantity = (productId: string): number => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Conversion de W/h à kWh/an: W/h * 24h * 365j / 1000
  const totalProduction = cart.reduce((total, item) => {
    const annualProduction = (item.product.production * 24 * 365) / 1000;
    return total + annualProduction * item.quantity;
  }, 0);

  const coveragePercentage = Math.min(
    (totalProduction / energyConsumption) * 100,
    100
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="space-y-4 py-8">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
      </div>
    );

  return (
    <div className="space-y-8">
      <Input
        placeholder="Votre consommation annuelle en kWh"
        value={energyConsumption}
        onChange={(e) =>
          setEnergyConsumption(Number.parseInt(e.target.value) || 0)
        }
        className="w-full"
        type="number"
      />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Votre consommation énergétique
            </h2>
            <p className="text-gray-600">{energyConsumption} kWh/an</p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              Production sélectionnée: {totalProduction.toFixed(2)} kWh/an
            </p>
            <p className="text-sm text-gray-600">
              {coveragePercentage.toFixed(1)}% de votre consommation
            </p>
          </div>
        </div>
        <Progress value={coveragePercentage} className="h-4" />

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {coveragePercentage < 100
              ? `Il vous manque ${(energyConsumption - totalProduction).toFixed(
                  0
                )} kWh/an pour couvrir votre consommation`
              : "Votre consommation est entièrement couverte !"}
          </div>
          <div className="font-semibold">Total: {totalPrice.toFixed(2)} €</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const quantity = getProductQuantity(product.id);
          // Calcul de la production annuelle en kWh pour l'affichage
          const annualProduction = (
            (product.production * 24 * 365) /
            1000
          ).toFixed(2);

          return (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col h-full"
            >
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.label}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    product.type === 0 ? "bg-amber-500" : "bg-blue-500"
                  }`}
                >
                  {product.type === 0 ? "Solaire" : "Éolien"}
                </Badge>
              </div>

              <CardContent className="pt-4 flex-grow">
                <h3 className="font-bold text-lg mb-2">{product.label}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Production:</span>
                    <span className="font-medium">
                      {product.production} W/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Production annuelle:</span>
                    <span className="font-medium">
                      {annualProduction} kWh/an
                    </span>
                  </div>
                  {product.sfPanel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface:</span>
                      <span className="font-medium">{product.sfPanel} m²</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xl font-bold text-right">
                  {product.price} €
                </div>
              </CardContent>

              <CardFooter className="pt-0 mt-auto">
                {quantity === 0 ? (
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full"
                    variant="default"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addToCart(product)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
