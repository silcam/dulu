function differentIds(model1, model2) {
  if (model1 && model2) {
    return model1.id != model2.id;
  }
  if ((model1 && !model2) || (model2 && !model1)) {
    return true;
  }
  return false;
}

export default differentIds;
