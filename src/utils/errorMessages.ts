// src/utils/errorMessages.ts
export const ERROR_MESSAGES = {
  PRODUCTS: {
    FETCH_ERROR: "Impossible de charger les produits",
    NOT_FOUND: "Produit non trouvé",
    STOCK_ERROR: "Stock insuffisant",
    INVALID_PRICE: "Prix invalide",
    INVALID_STOCK: "Quantité en stock invalide",
    INVALID_ID: "Identifiant de produit invalide",
    INVALID_NAME: "Nom de produit invalide",
    INVALID_DESCRIPTION: "Description de produit invalide",
  },

  CART: {
    ADD_ERROR: "Impossible d'ajouter au panier",
    UPDATE_ERROR: "Impossible de mettre à jour la quantité",
    REMOVE_ERROR: "Impossible de supprimer l'article",
    STOCK_LIMIT: "Quantité demandée non disponible",
    EMPTY_CART: "Le panier est vide",
    INVALID_QUANTITY: "Quantité invalide",
    MAX_QUANTITY: "Quantité maximum atteinte",
    PRODUCT_NOT_AVAILABLE: "Ce produit n'est plus disponible",
    CALCULATION_ERROR: "Erreur lors du calcul du total",
  },

  ORDER: {
    CREATE_ERROR: "Erreur lors de la création de la commande",
    FETCH_ERROR: "Erreur lors de la récupération des commandes",
    UPDATE_ERROR: "Erreur lors de la mise à jour de la commande",
    DELETE_ERROR: "Erreur lors de la suppression de la commande",
    INVALID_EMAIL: "L'adresse email n'est pas valide",
    EMPTY_ORDER: "La commande ne peut pas être vide",
    INVALID_AMOUNT: "Le montant de la commande n'est pas valide",
    PROCESSING_ERROR: "Erreur lors du traitement de la commande",
    STOCK_VALIDATION_ERROR: "Erreur de validation des stocks",
    INVALID_STATUS: "Statut de commande invalide",
    DUPLICATE_ORDER: "Cette commande existe déjà",
    CREATION_FAILED: "La création de la commande a échoué"  },

  VALIDATION: {
    REQUIRED_FIELD: "Ce champ est requis",
    INVALID_FORMAT: "Format invalide",
    MIN_VALUE: "Valeur minimale non atteinte",
    MAX_VALUE: "Valeur maximale dépassée",
    INVALID_EMAIL: "L'adresse email n'est pas valide",
    INVALID_QUANTITY: "La quantité doit être un nombre entier positif",
    INSUFFICIENT_STOCK: "Stock insuffisant",
    INVALID_PRICE: "Le prix doit être un nombre positif",
    INVALID_STOCK: "Le stock doit être un nombre entier positif ou nul",
    INVALID_PRODUCT_ID: "L'identifiant du produit n'est pas valide",
    INVALID_PRODUCT_NAME: "Le nom du produit est requis",
    NUMBER_OUT_OF_RANGE: "La valeur est hors limites",
    INVALID_DATE: "Date invalide",
    INVALID_PHONE: "Numéro de téléphone invalide",
    EMPTY_ORDER: "La commande ne peut pas être vide",
    EMPTY_CART: "Le panier ne peut pas être vide",
    INVALID_ORDER_STATUS: "Le statut de la commande n'est pas valide",
    INVALID_ORDER_ID: "L'identifiant de la commande n'est pas valide",
    INVALID_IMAGE_URL: "L'URL de l'image n'est pas valide"
  },

  API: {
    NETWORK_ERROR: "Erreur de connexion au serveur",
    TIMEOUT_ERROR: "Le serveur met trop de temps à répondre",
    SERVER_ERROR: "Erreur serveur interne",
    UNAUTHORIZED: "Accès non autorisé",
    FORBIDDEN: "Accès interdit",
    NOT_FOUND: "Ressource non trouvée",
    BAD_REQUEST: "Requête invalide",
  },

  SYSTEM: {
    UNKNOWN_ERROR: "Une erreur inconnue est survenue",
    INITIALIZATION_ERROR: "Erreur lors de l'initialisation",
    STORAGE_ERROR: "Erreur de stockage local",
    PROCESSING_ERROR: "Erreur lors du traitement",
  },
};
