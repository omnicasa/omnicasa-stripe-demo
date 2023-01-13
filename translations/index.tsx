type keys = "recurring.title" | "recurring.description" | "save";

export const locales = ["en", "fr", "nl"] as const;

export type Locales = "en" | "fr" | "nl";

export const translations: { [key in Locales]: { [key in keys]: string } } = {
  nl: {
    "recurring.title": "Omnicasa Herhalende betalingen",
    "recurring.description": "Herhaal betalingen automatisch",
    save: "Opslaan",
  },
  en: {
    "recurring.title": "Omnicasa Recurring payments",
    "recurring.description": "Automatically repeat payments",
    save: "Save",
  },
  fr: {
    "recurring.title": "Omnicasa Paiements récurrents",
    "recurring.description": "Répétez automatiquement les paiements",
    save: "Sauvegarder",
  },
};
