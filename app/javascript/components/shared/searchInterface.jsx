import axios from "axios";
import React from "react";

export default function searchInterface(WrappedComponent, minQueryLength) {
  return class SearchInterface extends React.PureComponent {
    queryNum = 0;
    displayedQuery = 0;

    constructor(props) {
      super(props);
      this.state = {
        query: "",
        results: [],
        noResults: false
      };
    }

    componentWillUnmount() {
      // Prevent any pending state updates
      this.displayedQuery = this.queryNum + 1;
    }

    getQueryNum = () => {
      this.queryNum += 1;
      return this.queryNum;
    };

    setRefireTimer = () => {
      this.refireTimer = setTimeout(this.onRefireTimer, 400);
    };

    onRefireTimer = () => {
      this.refireTimer = null;
      if (this.nextQuery) {
        this.search(this.nextQuery);
        this.nextQuery = null;
      }
    };

    updateQuery = query => {
      if (query.length == 0) {
        this.displayedQuery = this.getQueryNum();
        this.nextQuery = null;
        this.setState({
          results: [],
          noResults: false
        });
      } else {
        this.search(query);
      }
    };

    search = query => {
      if (query.length < minQueryLength) return;

      if (this.refireTimer) {
        this.nextQuery = query;
        return;
      }

      const qNum = this.getQueryNum();
      axios
        .get(this.props.queryPath, {
          params: { q: query }
        })
        .then(response => {
          if (qNum > this.displayedQuery) {
            this.displayedQuery = qNum;
            this.setState({
              results: response.data,
              noResults: response.data.length == 0
            });
          }
        })
        .catch(error => console.error(error));

      this.setRefireTimer();
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          results={this.state.results}
          noResults={this.state.noResults}
          updateQuery={this.updateQuery}
        />
      );
    }
  };
}
