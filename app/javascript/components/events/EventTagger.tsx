import React from "react";
import { IEvent } from "../../models/Event";
import { useDispatch } from "react-redux";
import useTranslation from "../../i18n/useTranslation";
import SearchTextInput, { SearchItem } from "../shared/SearchTextInput";
import useLoad from "../shared/useLoad";
import update from "immutability-helper";
import styles from "./EventTagger.css";
import { Link } from "react-router-dom";
import { addTagAction } from "../../reducers/tagsReducer";

interface IProps {
  editing?: boolean;
  event: IEvent;
  updateEvent: (e: Partial<IEvent>) => void;
}

export default function EventTagger(props: IProps) {
  const t = useTranslation();
  const dispatch = useDispatch();
  const [saveLoad] = useLoad();

  const addTag = (event: IEvent, name: string) => {
    console.log("addTag called: " + name + " and " + event);
    console.log(" [addTag] postToApi and add to draftEvent");
    save(name);
  };

  const setTag = (id: number, name: string) => {
    console.log("setTag called: " + id);
    props.updateEvent(
      update(props.event, {
        tag_ids: {
          $push: [id]
        },
        tags: {
          $push: [{ id: id, name: name }]
        }
      })
    );
    // TODO should only happen on a newly created tags
    // or maybe this is fine as is
    // dispatch to add tag to redux
    dispatch(addTagAction(id, name));
    // then read from redux on all subsequent reads.
  };

  const removeTag = (id: number, name: string) => {
    console.log("removeTag called: " + id + " and " + name);
    const new_tags = props.event.tags.filter(t => t.id != id);
    const new_tag_ids = props.event.tag_ids.filter(i => i != id);
    props.updateEvent(
      update(props.event, {
        tag_ids: { $set: new_tag_ids },
        tags: { $set: new_tags }
      })
    );
  };

  const save = async (name: string) => {
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/tags", {
        tags: { tagname: name }
      })
    );
    if (data) {
      if (data.tags) {
        props.updateEvent(
          update(props.event, {
            tag_ids: {
              $push: [data.tags[0].id]
            },
            tags: {
              $push: [{ id: data.tags[0].id, name: data.tags[0].name }]
            }
          })
        );
      }
    }
    return data;
  };

  return (
    <div>
      <div>{props.editing ? t("Tag this event:") : t("Event tags:")}</div>
      <div>
        Current tags:
        <ul>
          {props.event.tags.map(tag => (
            <li className={styles.tag} key={tag.id}>
              <Link
                className={"tagname"}
                to={`/languages/61/taggedevents/` + tag.name}
              >
                {tag.name}
              </Link>{" "}
              {props.editing ? (
                <button
                  onClick={() => {
                    removeTag(tag.id, tag.name);
                  }}
                >{`x`}</button>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {props.editing ? (
          <SearchTextInput<SearchItem>
            queryPath={"/api/tags/search"}
            addBox={true}
            updateValue={item => item && setTag(item.id, item.name)}
            display={i => i.name}
            notListed={{
              label: t("Create tag"),
              onClick: name => {
                addTag(props.event, name);
              }
            }}
          />
        ) : (
          "List of tags"
        )}
      </div>
    </div>
  );
}
