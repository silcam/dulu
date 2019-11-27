import List from "./List";
import { ILanguage } from "./Language";
import { ICluster } from "./Cluster";
import { IRegion } from "./Region";
import { Domain, Domains } from "./Domain";
import { allMatches } from "../util/stringUtils";

export interface NotificationChannels {
  languages: ILanguage[];
  clusters: ICluster[];
  regions: IRegion[];
  domains: Domain[];
}

function domainChannel(domain: Domain) {
  return `D${domain.slice(0, 3)}`;
}

function emptyNtfnChannels(): NotificationChannels {
  return {
    languages: [],
    clusters: [],
    regions: [],
    domains: []
  };
}

interface Objects {
  languages: List<ILanguage>;
  clusters: List<ICluster>;
  regions: List<IRegion>;
}

export function parseChannels(
  channels: string,
  objects: Objects
): NotificationChannels {
  const outChannels = emptyNtfnChannels();
  let ids = allMatches(channels, /Lng(\d+)/g, 1);
  outChannels.languages = ids.map(id => objects.languages.get(parseInt(id)));
  ids = allMatches(channels, /Cls(\d+)/g, 1);
  outChannels.clusters = ids.map(id => objects.clusters.get(parseInt(id)));
  ids = allMatches(channels, /Reg(\d+)/g, 1);
  outChannels.regions = ids.map(id => objects.regions.get(parseInt(id)));
  outChannels.domains = Domains.filter(domain =>
    channels.includes(domainChannel(domain))
  );
  return outChannels;
}

export function channelsString(channels: NotificationChannels): string {
  let str = "";
  str += channels.languages.map(lng => `Lng${lng.id} `).join("");
  str += channels.clusters.map(c => `Cls${c.id} `).join("");
  str += channels.regions.map(r => `Reg${r.id} `).join("");
  str += channels.domains.map(d => `${domainChannel(d)} `).join("");
  return str;
}
