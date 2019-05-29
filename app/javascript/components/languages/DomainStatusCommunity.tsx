import React from "react";
import { IDomainStatusItem } from "../../models/DomainStatusItem";
import List from "../../models/List";
import { IPerson } from "../../models/Person";

interface IProps {
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
  people: List<IPerson>;
}

export default function DomainStatusCommunity(props: IProps) {
  return <tr />;
}
