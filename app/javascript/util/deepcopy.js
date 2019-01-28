import merge from "deepmerge";

export default function deepcopy(obj) {
  return merge(obj, {});
}
