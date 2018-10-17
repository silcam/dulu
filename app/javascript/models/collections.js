// Not used...
// It doens't work because it wants the collection to be passed up front
// but in practice I want to use the collection that will exist after the
// network request completes
// We want to update state with prevState.collection

// Could rewrite where it returns an update function ???

// import axios from "axios";
// import update from "immutability-helper";
// import { findIndexById, insertInto, deleteFrom } from "../util/findById";
// import { axiosDelete } from "../util/network";

// export default function Collections() {}

// Collections.authToken = "";

// Collections.index = async type => {
//   const response = await axios.get(baseUrl(type));
//   return response.data[pluralize(type)];
// };

// Collections.fetch = async (collection, type, id) => {
//   const response = await axios.get(itemUrl(type, id));
//   return update(collection, {
//     [findIndexById(collection, id)]: { $set: response.data[type] }
//   });
// };

// Collections.add = async (collection, type, item, itemCompare) => {
//   const response = await axios.post(baseUrl(type), {
//     authenticity_token: Collections.authToken,
//     [type]: item
//   });
//   const newItem = response.data[type];
//   return itemCompare
//     ? insertInto(collection, newItem, itemCompare)
//     : update(collection, { $push: [newItem] });
// };

// Collections.update = async (collection, type, item) => {
//   const response = await axios.put(itemUrl(type, item.id), {
//     authenticity_token: Collections.authToken,
//     [type]: item
//   });
//   return update(collection, {
//     [findIndexById(collection, item.id)]: { $set: response.data[type] }
//   });
// };

// Collections.delete = async (collection, type, id) => {
//   const response = await axiosDelete(itemUrl(type, id), {
//     authenticity_token: Collections.authToken
//   });
//   return deleteFrom(collection, id);
// };

// function itemUrl(type, id) {
//   return `${baseUrl(type)}/${id}`;
// }

// function baseUrl(type) {
//   return `/api/${pluralize(type)}`;
// }

// function pluralize(type) {
//   switch (type) {
//     case "person":
//       return "people";
//     default:
//       return type + "s";
//   }
// }
