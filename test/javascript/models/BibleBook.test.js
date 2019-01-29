import BibleBook from "models/BibleBook";
import translator from "i18n/i18n";

const t = translator("en");

test("name", () => {
  expect(BibleBook.name(5, t)).toEqual("Deuteronomy");
});

test("get books", () => {
  const books = BibleBook.books(t);
  expect(books.length).toBe(66);
  expect(books[1]).toEqual({
    id: 2,
    name: "Exodus"
  });
});
