import React from "react";
import deepcopy from "../../util/deepcopy";
import SaveIndicator from "../shared/SaveIndicator";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LanguagePageContent from "./LanguagePageContent";

const tabs = [/*"All",*/ "Translation", "Linguistics", "Literacy", "Media"];

export default class LanguagePage extends React.PureComponent {
  state = {
    language: deepcopy(this.props.language)
  };

  render() {
    const language = this.state.language;
    const t = this.props.t;
    return (
      <div>
        <SaveIndicator
          t={this.props.t}
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />
        <h2>{language.name}</h2>
        <Tabs>
          <TabList>
            {tabs.map(name => (
              <Tab key={name}>{t(`domains.${name}`)}</Tab>
            ))}
          </TabList>
          {tabs.map(name => (
            <TabPanel key={name}>
              <LanguagePageContent language={language} tab={name} t={t} />
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  }
}
