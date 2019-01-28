import React from "react";
import searchInterface from "../shared/searchInterface";
import TextInput from "../shared/TextInput";
import ResultsRows from "./ResultsRows";
import styles from "./Searcher.css";

class BasicSearcher extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.updateQuery(e.target.value);
  };

  goToFirstResult = () => {
    if (this.props.results[0] && this.props.results[0].route) {
      window.location.href = this.props.results[0].route;
    }
  };

  render() {
    return (
      <div className={styles.searcher}>
        <TextInput
          handleInput={this.handleInput}
          name="query"
          value={this.state.query}
          placeholder={this.props.t("Search_prompt")}
          handleEnter={this.goToFirstResult}
        />

        {this.props.noResults && <p>No Results</p>}

        {this.props.results.length > 0 && (
          <table className="table">
            <tbody>
              <ResultsRows results={this.props.results} padding="0" />
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const Searcher = searchInterface(BasicSearcher, 3);

export default Searcher;
