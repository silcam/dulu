import { useEffect, useState } from "react";
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
  const [resultsContainer, setResultsContainer] = useState<
    ResultsContainer<SearchResult>
  >({});
  const updateResultsContainer = (query: string, results: SearchResult[]) =>
    setResultsContainer(
      update(resultsContainer, { [query]: { $set: results } })
    );

  useEffect(() => {
    if (query.length < minQueryLength) return;
    if (resultsContainer[query] !== undefined) return; // No need to search

    search(queryPath, query, updateResultsContainer);
  }, [query]);

  return bestResults(query, resultsContainer);
}

async function search<SearchResult>(
  queryPath: string,
  query: string,
  updateResultsContainer: (q: string, r: SearchResult[]) => void
) {
  const data = await DuluAxios.get(queryPath, { q: query });
  if (data) {
    updateResultsContainer(query, data.results);
  }
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
