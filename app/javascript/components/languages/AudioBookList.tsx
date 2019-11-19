import React, { useContext } from "react";
import { IActivity } from "../../models/Activity";
import I18nContext from "../../contexts/I18nContext";
import BibleBook from "../../models/BibleBook";

interface IProps {
  activity: IActivity;
}

export default function AudioBookList(props: IProps) {
  const t = useContext(I18nContext);

  return isOtherAudioScriptureActivity(props.activity) ? (
    <span className="subheader" style={{ display: "block" }}>
      {props.activity.bible_book_ids
        .map(id => BibleBook.name(id, t))
        .join(", ")}
    </span>
  ) : null;
}

function isOtherAudioScriptureActivity(activity: IActivity) {
  return (
    activity.type == "MediaActivity" &&
    activity.category == "AudioScripture" &&
    activity.scripture == "Other"
  );
}
