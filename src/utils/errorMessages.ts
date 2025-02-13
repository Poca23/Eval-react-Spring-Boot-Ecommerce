// src/utils/errorMessages.ts
import '../../styles/index.css';

export const ERROR_MESSAGES = {
  PRODUCTS: {
    FETCH_ERROR: "Impossible de charger les produits",
    NOT_FOUND: "Produit non trouvé",
    STOCK_ERROR: "Stock insuffisant",
    INVALID_PRICE: "Prix invalide",
    INVALID_STOCK: "Quantité en stock invalide",
  },
  CART: {
    ADD_ERROR: "Impossible d'ajouter au panier",
    UPDATE_ERROR: "Impossible de mettre à jour la quantité",
    STOCK_LIMIT: "Quantité demandée non disponible",
    EMPTY_CART: "Le panier est vide",
    INVALID_QUANTITY: "Quantité invalide",
    MAX_QUANTITY: "Quantité maximum atteinte",
    PRODUCT_NOT_AVAILABLE: "Ce produit n'est plus disponible",
  },
  ORDER: {
    CREATE_ERROR: "Erreur lors de la création de la commande",
    FETCH_ERROR: "Impossible de charger les commandes",
    INVALID_EMAIL: "Veuillez entrer une adresse email valide",
    EMPTY_ORDER: "Impossible de créer une commande vide",
    INVALID_AMOUNT: "Montant total invalide",
    PROCESSING_ERROR: "Erreur lors du traitement de la commande",
    STOCK_VALIDATION_ERROR:
      "Certains produits ne sont plus disponibles en quantité suffisante",
  },
  VALIDATION: {
    REQUIRED_FIELD: "Ce champ est requis",
    INVALID_FORMAT: "Format invalide",
    MIN_VALUE: "Valeur minimale non atteinte",
    MAX_VALUE: "Valeur maximale dépassée",
  },
};
