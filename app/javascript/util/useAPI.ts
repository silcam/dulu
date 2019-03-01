import { Setter, Adder, AnyObj } from "../models/TypeBucket";
import { useEffect, useState } from "react";
import DuluAxios from "./DuluAxios";

const actionByDataKey: { [key: string]: string | string[] | undefined } = {
  activity: "setActivity",
  cluster: "setCluster",
  language: "setLanguage",
  participants: "addParticipants",
  people: ["addPeople", "setPeople"]
};

export interface ActionPack {
  [name: string]: Setter<any> | Adder<any>;
}

export function useAPIGet(
  url: string,
  params: AnyObj = {},
  actions: ActionPack,
  refresh: any[] = []
) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    DuluAxios.get(url, params).then(data => {
      if (data) updateStore(data, actions);
      setLoading(false);
    });
  }, refresh);
  return loading;
}

export function useAPIPost(
  url: string,
  data: AnyObj,
  actions: ActionPack
): [boolean, () => Promise<boolean>] {
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const responseData = await DuluAxios.post(url, data);
    if (responseData) updateStore(responseData, actions);
    setSaving(false);
    return true;
  };
  return [saving, save];
}

export function useAPIPut(
  url: string,
  data: AnyObj,
  actions: ActionPack
): [boolean, () => Promise<boolean>] {
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const responseData = await DuluAxios.put(url, data);
    if (responseData) updateStore(responseData, actions);
    setSaving(false);
    return true;
  };
  return [saving, save];
}

function updateStore(data: AnyObj, actions: ActionPack) {
  Object.keys(data).forEach(key => {
    const actionName = actionByDataKey[key];
    switch (typeof actionName) {
      case "string":
        if (!actions[actionName])
          throw `useAPI: no action provided for ${key} key. Tried ${actionName}.`;
        actions[actionName](data[key]);
        break;
      case "object": // That is, string[]
        const foundActionName = actionName.find(
          possibleActionName => !!actions[possibleActionName]
        );
        if (!foundActionName)
          throw `useAPI: no action provided for ${key} key. Tried ${JSON.stringify(
            actionName
          )}`;
        actions[foundActionName](data[key]);
        break;
      default:
        throw `useAPI: actionByDataKey has no entry for ${key}`;
    }
  });
}
