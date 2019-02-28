import { useEffect, useRef } from "react";
import DuluAxios from "../../util/DuluAxios";
import update from "immutability-helper";

interface ResultsContainer<SearchResult> {
  [query: string]: SearchResult[] | undefined;
}

/*
  Returns undefined until the API returns results.
  An empty result list means the API returned no results.
*/

export default function useSearch<SearchResult>(
  queryPath: string,
  query: string,
  minQueryLength: number
) {
  const resultsContainer = useRef<ResultsContainer<SearchResult>>({});

  useEffect(() => {
    if (query.length < minQueryLength) return;
    if (resultsContainer.current[query] !== undefined) return; // No need to search

    search(queryPath, query).then(
      results =>
        (resultsContainer.current = updateResultsContainer(
          resultsContainer.current,
          query,
          results
        ))
    );
  }, [query]);

  return bestResults(query, resultsContainer.current);
}

async function search(queryPath: string, query: string) {
  const data = await DuluAxios.get(queryPath, { q: query });
  if (data) {
    return data.results;
  }
}

function updateResultsContainer(
  resultsContainer: ResultsContainer<any>,
  query: string,
  results: any[]
) {
  return update(resultsContainer, { [query]: { $set: results } });
}

function bestResults<SearchResult>(
  query: string,
  resultsContainer: ResultsContainer<SearchResult>
) {
  if (resultsContainer[query] !== undefined) return resultsContainer[query];
  let subQuery = query.slice(0, -1);
  while (subQuery.length > 0) {
    if (resultsContainer[subQuery] !== undefined)
      return resultsContainer[subQuery];
    subQuery = subQuery.slice(0, -1);
  }
  return undefined;
}
