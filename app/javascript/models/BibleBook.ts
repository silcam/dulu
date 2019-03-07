import { T } from "../i18n/i18n";

export interface IBibleBook {
  id: number;
  name: string;
}

function name(id: number, t: T): string {
  const index = id - 1; // Genesis has id 1
  return t("bible_books")[index];
}

function books(t: T): IBibleBook[] {
  return t("bible_books").map((name: string, index: number) => ({
    id: index + 1, // Genesis has id 1
    name: name
  }));
}

export default {
  name,
  books
};
