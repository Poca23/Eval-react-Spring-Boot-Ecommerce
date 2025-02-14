# 🛍️ Simple E-Commerce React & Spring Boot

## 📝 Description

Un projet e-commerce moderne et minimaliste permettant aux utilisateurs de parcourir des produits, gérer leur panier d'achats et passer des commandes. L'application inclut également une interface administrateur pour la gestion des commandes.

## 🚀 Features

- 📦 Affichage des produits avec recherche et filtrage
- 🛒 Gestion du panier avec persistance localStorage
- 💳 Système de commande avec validation
- 👨‍💼 Interface admin pour gestion des commandes
- 🌓 Mode sombre/clair
- 📱 Design responsive
- ♿ Accessibilité optimisée
- 🔐 Validation des données
- 🚨 Gestion des erreurs unifiée

## 🛠️ Tech Stack

### Frontend

- ⚛️ React 18 avec TypeScript
- 🎨 CSS Modules & Variables CSS
- 🔄 React Router DOM v6
- 🧪 Jest & React Testing Library
- 📝 TypeScript strict mode

### Backend

- ☕ Spring Boot 3
- 🎲 MySQL 8
- 📡 REST API
- 🔒 Validation des données

## ✅ Tests

L'application inclut une suite complète de tests :

- Tests unitaires des composants
- Tests d'intégration des contextes
- Tests des formulaires et validations
- Tests de gestion des erreurs
- Mocks et fixtures

## 🏗️ Structure du Projet

src/
├── _mocks_/
│ ├── CartContext.tsx
│ └── react-router-dom.tsx
│ ├── admin/
│ │ ├── AdminOrders.tsx
│ ├── cart/
│ │ ├── Cart.tsx
│ │ ├── CartItem.tsx
│ │ ├── CartSummary.tsx
│ │ ├── CheckoutForm.tsx
│ │ └── OrderConfirmation.tsx
│ ├── common/
│ │ ├── ErrorMessage.tsx
│ │ └── Toast.tsx
│ ├── layout/
│ │ ├── Footer.tsx
│ │ ├── Header.tsx
│ │ └── Layout.tsx
│ ├── orders/
│ │ ├── OrderList.tsx
│ │ └── OrderSearch.tsx
│ └── products/
│ ├── ProductCard.tsx
│ ├── ProductDetail.tsx
│ ├── ProductList.tsx
│ └── ProductSearch.tsx
├── config/
│ └── api.config.ts
├── contexts/
│ ├── CartContext.tsx
│ └── ErrorContext.tsx
├── hooks/
│ ├── useCart.ts
│ ├── useError.ts
│ ├── useOrders.ts
│ ├── useProducts.ts
│ └── useStock.ts
├── services/
│ ├── api.ts
│ ├── localStorage.ts
│ └── stockService.ts
├── tests/
│ ├── OrderList.test.txt
│ ├── CheckoutForm.test.tsx
│ ├── CartContext.test.tsx
│ ├── ErrorContext.test.tsx
│ └── ProductList.test.tsx
├── types/
│ └── index.ts
├── utils/
│ ├── errorHandlers.ts
│ ├── errorMessages.ts
│ ├── formatters.ts
│ └── validators.ts
├── App.css
├── App.test.tsx
├── App.tsx
├── styles/
│ └──index.css
├── jest.config.js
├── index.tsx
├── logo.svg
├── reportWebVitals.ts
└── setupTests.ts (mis à jour)

## 💻 Installation

### Prérequis

- Node.js (v16+)
- Java JDK 17+
- MySQL 8+

### Frontend (React)

```bash
cd frontend
npm install
npm start

Backend (Spring Boot)
cd backend
mvn spring-boot:run

Configuration Base de données
CREATE DATABASE ecommerce;
USE ecommerce;
-- Exécuter le script SQL fourni dans /backend/src/main/resources/schema.sql

🌐 API Endpoints
Products
GET /api/products - Liste tous les produits
GET /api/products/{id} - Détails d'un produit
POST /api/products - Crée un produit
PUT /api/products/{id} - Met à jour un produit
DELETE /api/products/{id} - Supprime un produit
Orders
GET /api/orders - Liste toutes les commandes
GET /api/orders/{id} - Détails d'une commande
POST /api/orders - Crée une commande
GET /api/orders/search - Recherche des commandes
🧪 Tests
Pour exécuter les tests :

# Frontend
npm test

# Backend
mvn test

📚 Documentation
Guide de développement
Documentation API
Guide des tests
✨ Fonctionnalités implémentées
✅ Système de panier complet
✅ Validation des commandes
✅ Gestion des stocks
✅ Interface administrateur
✅ Tests automatisés
✅ Responsive design
✅ Dark mode
✅ Gestion des erreurs
🔜 Améliorations futures
Authentification utilisateur
Paiement en ligne
Historique des commandes par utilisateur
Système de notifications
PWA support
👥 Contribution
Fork le projet
Créer une branche (git checkout -b feature/AmazingFeature)
Commit les changements (git commit -m 'Add some AmazingFeature')
Push vers la branche (git push origin feature/AmazingFeature)
Ouvrir une Pull Request
📜 License
MIT License

👤 Contact
CNDWeb37 - Web is Yours - cndweb37@gmail.com
```
