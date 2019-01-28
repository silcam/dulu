export default class BibleBook {
  static name(id, t) {
    const index = id - 1; // Genesis has id 1
    return t("bible_books")[index];
  }

  static books(t) {
    return t("bible_books").map((name, index) => ({
      id: index + 1, // Genesis has id 1
      name: name
    }));
  }
}
