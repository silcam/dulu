import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  DSISubcategories
} from "../../../app/javascript/models/DomainStatusItem";
import translator, { Locale } from "../../../app/javascript/i18n/i18n";
import {
  domainStatusItemFactory,
  organizationFactory,
  personFactory
} from "../testUtil";

const mockDSI: IDomainStatusItem = {
  id: 0,
  language_id: 0,
  category: DSICategories.PublishedScripture,
  subcategory: DSISubcategories.Portions,
  description: "",
  year: 2000,
  platforms: "",
  organization_id: 303,
  person_id: 404,
  creator_id: 404,
  bible_book_ids: [1, 2]
};

const t = translator(Locale.en);

const mockPeople = {
  404: personFactory({ id: 404, first_name: "Joe", last_name: "Shmoe" })
};

const mockOrganizations = {
  303: organizationFactory({ id: 303, short_name: "MocksRUs" })
};

test("DSI: platformsStr", () => {
  expect(DomainStatusItem.platformsStr(false, false)).toEqual("");
  expect(DomainStatusItem.platformsStr(false, true)).toEqual("iOS");
  expect(DomainStatusItem.platformsStr(true, true)).toEqual("Android|iOS");
});

test("DSI books", () => {
  expect(DomainStatusItem.books(mockDSI, t)).toEqual("Genesis-Exodus");
  const noBooks = domainStatusItemFactory({ bible_book_ids: [] });
  expect(DomainStatusItem.books(noBooks, t)).toEqual("");
});

test("DSI: personName", () => {
  expect(DomainStatusItem.personName(mockDSI, mockPeople)).toEqual("Joe Shmoe");
  const noJoe = domainStatusItemFactory({ person_id: null });
  expect(DomainStatusItem.personName(noJoe, mockPeople)).toEqual("");
});

test("DSI: orgName", () => {
  expect(DomainStatusItem.orgName(mockDSI, mockOrganizations)).toEqual(
    "MocksRUs"
  );
  const noOrg = domainStatusItemFactory({ organization_id: null });
  expect(DomainStatusItem.orgName(noOrg, mockOrganizations)).toEqual("");
});
