# 🌍 Zobie le Climat

Zobie le Climat est une application innovante qui aide à déterminer la meilleure source d'énergie renouvelable (solaire ou éolienne) en fonction des conditions climatiques d'une zone géographique donnée.

## PROD https://zobie-le-climat.onrender.com/

## 🚀 Fonctionnalités

- **Analyse des conditions climatiques** : Utilisation de l'API NASA POWER pour obtenir des données météorologiques précises
- **Calculs d'énergie** :
  - Énergie solaire basée sur l'irradiation solaire
  - Énergie éolienne basée sur la vitesse du vent et la densité de l'air
- **Visualisations** :
  - Graphiques de température
  - Graphiques de vitesse du vent
  - Graphiques de précipitations
- **Recommandations** : Analyse comparative des sources d'énergie avec pourcentages de recommandation

## 🛠️ Technologies utilisées

- **Backend** : NestJS (Node.js)
- **Front** : NextJs 
- **API** : NASA POWER API
- **Visualisation** : Graphiques interactifs
- **Calculs** : Formules scientifiques pour l'énergie solaire et éolienne

## 📊 Endpoints API

### Données météorologiques
- `GET /weather/graph/solar` : Données d'irradiation solaire
- `GET /weather/graph/wind` : Données de vitesse du vent
- `GET /weather/graph/temperature` : Données de température
- `GET /weather/graph/rain` : Données de précipitations

### Calculs d'énergie
- `GET /weather/power/wind` : Calcul de puissance éolienne
- `GET /weather/power/solar` : Calcul de puissance solaire
- `GET /weather/power/recommendation` : Recommandation de source d'énergie

## 🔧 Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm run start:dev
```

## 🌐 Utilisation

L'application nécessite les paramètres suivants pour fonctionner :
- Latitude
- Longitude
- Période d'analyse (dates de début et de fin)

## 📝 Formules utilisées

### Énergie solaire
```
Énergie = Irradiation × Surface × Rendement × Heures d'ensoleillement / 100
```

### Énergie éolienne
```
Énergie = 0.5 × Densité de l'air × Surface des pales × Vitesse du vent³
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- [Votre Nom/Équipe]

---
Développé avec ❤️ pour un avenir plus vert
