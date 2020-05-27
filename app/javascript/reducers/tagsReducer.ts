import { ADD_TAG, TagAction } from "../actions/eventActions";
import { ITag } from "../models/Event";
import List from "../models/List";
import update from "immutability-helper";
import { isLoadAction } from "./LoadAction";

export interface TagState {
  list: List<ITag>;
}

const emptyState = {
  list: emptyTagList()
};

export default function tagsReducer(
  state = emptyState,
  action: TagAction
): TagState {
  if (isLoadAction(action)) {
    return {
      ...state,
      list: state.list
        .add(action.payload.tags)
        .remove(action.payload.deletedTags)
    };
  }
  switch (action.type) {
    case ADD_TAG:
      return update(state, {
        list: {
          $set: state.list.add([{ id: action.tag.id, name: action.tag.name }])
        }
      });
  }
  return state;
}

export function emptyTag(): ITag {
  return {
    id: 0,
    name: ""
  };
}

export function emptyTagList() {
  return new List(emptyTag(), []);
}

export function addTagAction(id: number, name: string) {
  return { type: ADD_TAG, tag: { id: id, name: name } };
}
