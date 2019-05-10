// import { mockDSI } from "./util/DomainStatusItem.test";
import { emptyPerson } from "../../app/javascript/reducers/peopleReducer";
import { emptyOrganization } from "../../app/javascript/reducers/organizationsReducer";
import { AnyObj } from "../../app/javascript/models/TypeBucket";
import {
  IDomainStatusItem,
  DSICategories,
  ScripturePortion
} from "../../app/javascript/models/DomainStatusItem";

const mockDSI: IDomainStatusItem = {
  id: 0,
  language_id: 0,
  category: DSICategories.PublishedScripture,
  subcategory: ScripturePortion.Portions,
  description: "",
  year: 2000,
  platforms: "",
  organization_id: 303,
  person_id: 404,
  creator_id: 404,
  bible_book_ids: [1, 2]
};

export function monthNames() {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
}

export function postponeFailure(date: Date) {
  expect(new Date().valueOf()).toBeLessThan(date.valueOf());
}

export function domainStatusItemFactory(params: AnyObj) {
  return Object.assign({}, mockDSI, params);
}

export function personFactory(params: AnyObj) {
  return Object.assign({}, emptyPerson, params);
}

export function organizationFactory(params: AnyObj) {
  return Object.assign({}, emptyOrganization, params);
}
