import { Setter, Adder, AnyObj, SetCan } from "../models/TypeBucket";
import { useEffect, useState } from "react";
import DuluAxios from "./DuluAxios";
import { ICan } from "../actions/canActions";

const actionByDataKey: { [key: string]: string | string[] | undefined } = {
  activity: "setActivity",
  can: "setCan",
  cluster: "setCluster",
  clusters: ["setClusters", "addClusters"],
  language: "setLanguage",
  languages: ["addLanguages", "setLanguages"],
  organizations: ["addOrganizations", "setOrganizations"],
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

interface SaveFunction {
  (cb?: () => void, otherData?: AnyObj): void;
}

export function useAPIPost(
  url: string,
  data: AnyObj,
  actions: ActionPack
): [boolean, SaveFunction] {
  return useAPIPostOrPut(url, data, actions, DuluAxios.post);
}

export function useAPIPut(
  url: string,
  data: AnyObj,
  actions: ActionPack
): [boolean, SaveFunction] {
  return useAPIPostOrPut(url, data, actions, DuluAxios.put);
}

function useAPIPostOrPut(
  url: string,
  data: AnyObj,
  actions: ActionPack,
  apiCall: (url: string, data: AnyObj) => Promise<AnyObj | undefined>
): [boolean, SaveFunction] {
  const [saving, setSaving] = useState(false);
  const save = async (successCallback?: () => void, otherData?: AnyObj) => {
    const putData = otherData || data;
    setSaving(true);
    const responseData = await apiCall(url, putData);
    setSaving(false);
    if (responseData) {
      updateStore(responseData, actions);
      if (successCallback) successCallback();
    }
  };
  return [saving, save];
}

export function useAPIDelete(
  url: string,
  actions: ActionPack,
  confirmMessage?: string
): [boolean, (cb: () => void) => void] {
  const [deleting, setDeleting] = useState(false);
  const deleteItem = async (successCallback?: () => void) => {
    if (confirmMessage && !confirm(confirmMessage)) return;
    setDeleting(true);
    const responseData = await DuluAxios.delete(url);
    if (responseData) {
      if (successCallback) successCallback();
      updateStore(responseData, actions);
    }
    setDeleting(false);
  };
  return [deleting, deleteItem];
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

export function setCanFor(setCan: SetCan, key: string) {
  return (can: ICan) => setCan(key, can);
}
