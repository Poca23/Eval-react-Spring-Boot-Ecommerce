// src/utils/formatters.ts

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};
