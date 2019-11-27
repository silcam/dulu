import React, { useContext, useState, useEffect } from "react";
import { IPerson } from "../../models/Person";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { IRegion } from "../../models/Region";
import I18nContext from "../../contexts/I18nContext";
import {
  parseChannels,
  NotificationChannels,
  channelsString
} from "../../models/NotificationChannel";
import SelectInput from "../shared/SelectInput";
import SearchPicker from "../shared/SearchPicker";
import update from "immutability-helper";
import MultiSelectItemList from "../shared/MultiSelectItemList";
import { Domains } from "../../models/Domain";

interface IProps {
  person: IPerson;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
  regions: List<IRegion>;
  updatePersonAndSave: (p: Partial<IPerson>) => void;
}

const channelTypes = ["Language", "Cluster", "Region", "Domain"];

export default function MyNotificationChannels(props: IProps) {
  const t = useContext(I18nContext);
  const channels = parseChannels(props.person.notification_channels, props);
  const [addWhat, setAddWhat] = useState(0); // Index of channelTypes
  const domainOpts = Domains.filter(d => !channels.domains.includes(d));
  const [addDomain, setAddDomain] = useState<string>(domainOpts[0] || "");
  useEffect(() => {
    if (domainOpts.length > 0 && !(domainOpts as string[]).includes(addDomain))
      setAddDomain(domainOpts[0]);
  });

  const updateChannels = (channels: NotificationChannels) =>
    props.updatePersonAndSave({
      notification_channels: channelsString(channels)
    });

  return (
    <React.Fragment>
      <tr>
        <th>{t("NotificationChannels")}</th>
        <td>
          <MultiSelectItemList
            items={channels.languages}
            display={lang => lang.name}
            removeItem={lang =>
              updateChannels(update(channels, { languages: filterOut(lang) }))
            }
          />
          <MultiSelectItemList
            items={channels.clusters}
            display={c => c.name}
            removeItem={c =>
              updateChannels(update(channels, { clusters: filterOut(c) }))
            }
          />
          <MultiSelectItemList
            items={channels.regions}
            display={r => r.name}
            removeItem={r =>
              updateChannels(update(channels, { regions: filterOut(r) }))
            }
          />
          <MultiSelectItemList
            items={channels.domains}
            display={t}
            removeItem={d =>
              updateChannels(update(channels, { domains: filterOut(d) }))
            }
          />
        </td>
      </tr>
      <tr>
        <th>{t("AddChannel")}</th>
        <td>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <SelectInput
              value={`${addWhat}`}
              options={channelTypes.map((cType, i) => ({
                value: `${i}`,
                display: t(cType)
              }))}
              setValue={val => setAddWhat(parseInt(val))}
            />
            {channelTypes[addWhat] === "Language" && (
              <SearchPicker
                collection={props.languages}
                selectedId={null}
                setSelected={lang =>
                  updateChannels(
                    update(channels, { languages: { $push: [lang] } })
                  )
                }
                placeholder={t("Add_language")}
                autoClear
              />
            )}
            {channelTypes[addWhat] === "Cluster" && (
              <SearchPicker
                collection={props.clusters}
                selectedId={null}
                setSelected={cluster =>
                  updateChannels(
                    update(channels, { clusters: { $push: [cluster] } })
                  )
                }
                placeholder={t("Add_cluster")}
                autoClear
              />
            )}
            {channelTypes[addWhat] === "Region" && (
              <SearchPicker
                collection={props.regions}
                selectedId={null}
                setSelected={region =>
                  updateChannels(
                    update(channels, { regions: { $push: [region] } })
                  )
                }
                placeholder={t("Add_region")}
                autoClear
              />
            )}
            {channelTypes[addWhat] === "Domain" && (
              <div>
                <SelectInput
                  value={addDomain}
                  options={SelectInput.translatedOptions(domainOpts, t)}
                  setValue={setAddDomain}
                />
                <button
                  className="small"
                  onClick={() =>
                    updateChannels(
                      update(channels, { domains: { $push: [addDomain] } })
                    )
                  }
                >
                  {t("Add")}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
}

function filterOut<T>(item: T): (list: T[]) => T[] {
  return list => list.filter(t => t != item);
}
