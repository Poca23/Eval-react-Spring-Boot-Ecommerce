🛍️ Simple E-Commerce React & Spring Boot
📝 Description
Un projet e-commerce moderne et minimaliste permettant aux utilisateurs de parcourir des produits et de gérer leur panier d'achats.

🚀 Features
📦 Affichage des produits
🛒 Gestion du panier
💳 Système de commande
👨‍💼 Interface admin
🛠️ Tech Stack
Frontend
⚛️ React (TypeScript)
🎨 TailwindCSS
🔄 React Router DOM
Backend
☕ Spring Boot
🎲 MySQL
📡 JDBC
🏗️ Structure du Projet
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── products/
│       ├── ProductCard.tsx
│       └── ProductList.tsx
├── types/
│   └── index.ts
└── App.tsx

💻 Installation
Cloner le repository
git clone [url-du-repo]

Frontend (React)
cd frontend
npm install
npm start

Backend (Spring Boot)
cd backend
mvn spring-boot:run

🌐 API Endpoints
Products
GET /api/products - Liste tous les produits
GET /api/products/{id} - Détails d'un produit
POST /api/products - Crée un produit
PUT /api/products/{id} - Met à jour un produit
DELETE /api/products/{id} - Supprime un produit
Orders
GET /api/orders - Liste toutes les commandes
POST /api/orders - Crée une commande
👥 Contribution
Fork le projet
Créer une branche (git checkout -b feature/AmazingFeature)
Commit les changements (git commit -m 'Add some AmazingFeature')
Push vers la branche (git push origin feature/AmazingFeature)
Ouvrir une Pull Request
📋 Todo
Implémentation du contexte du panier
Page panier
Système de commande
Interface admin
📜 License
MIT License

👤 Contact
CNDWeb37 - Web is Yours - [cndweb37@gmail.com]