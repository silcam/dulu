interface HasId {
  id: number;
}

function differentIds<T extends HasId>(model1: T, model2: T) {
  if (model1 && model2) {
    return model1.id != model2.id;
  }
  if ((model1 && !model2) || (model2 && !model1)) {
    return true;
  }
  return false;
}

export default differentIds;
