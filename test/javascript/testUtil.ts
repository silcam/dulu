// import { mockDSI } from "./util/DomainStatusItem.test";
import { emptyPerson } from "../../app/javascript/reducers/peopleReducer";
import { emptyOrganization } from "../../app/javascript/reducers/organizationsReducer";
import { AnyObj } from "../../app/javascript/models/TypeBucket";
import { IDomainStatusItem } from "../../app/javascript/models/DomainStatusItem";

const mockDSI: IDomainStatusItem = {
  id: 0,
  language_id: 0,
  category: "PublishedScripture",
  subcategory: "Portions",
  description: "",
  title: "",
  year: 2000,
  platforms: "",
  organization_ids: [303],
  person_ids: [404],
  creator_id: 404,
  bible_book_ids: [1, 2],
  completeness: "Draft",
  details: {},
  count: 0
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

export function domainStatusItemFactory(params: Partial<IDomainStatusItem>) {
  return Object.assign({}, mockDSI, params);
}

export function personFactory(params: AnyObj) {
  return Object.assign({}, emptyPerson, params);
}

export function organizationFactory(params: AnyObj) {
  return Object.assign({}, emptyOrganization, params);
}

export function dsiFactory(params: Partial<IDomainStatusItem>) {
  return Object.assign({}, mockDSI, params);
}
