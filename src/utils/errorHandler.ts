// src/utils/errorHandler.ts
import { ERROR_MESSAGES } from "./errorMessages";

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    // Erreurs spécifiques de l'API
    if ("response" in error) {
      const response = (error as any).response;
      switch (response?.status) {
        case 400:
          return ERROR_MESSAGES.VALIDATION.INVALID_FORMAT;
        case 401:
          return "Authentification requise";
        case 404:
          return ERROR_MESSAGES.PRODUCTS.NOT_FOUND;
        case 500:
          return "Erreur serveur interne";
        default:
          return error.message;
      }
    }
    return error.message;
  }
  return "Une erreur inattendue s'est produite";
};
