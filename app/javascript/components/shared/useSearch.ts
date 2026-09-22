import { useEffect, useState } from "react";
import DuluAxios from "../../util/DuluAxios";

interface ResultsContainer<SearchResult> {
  [key: string]: SearchResult[] | undefined;
}

interface SearchResults<SearchResult> {
  // undefined until something has come back for this query or one of its prefixes.
  // An empty array means the API answered and matched nothing.
  results: SearchResult[] | undefined;
  // True only when `results` is the answer to exactly what is typed now. While a
  // request is in flight the longest cached prefix is served instead, and a prefix
  // of a multi-word query is not a narrower search than the query -- the server ORs
  // the words, so "Drew M" matches everyone with an "m" in their name. A caller that
  // acts on the list without the user having pointed at a row has to check this.
  exact: boolean;
}

export default function useSearch<SearchResult>(
  queryPath: string,
  query: string,
  minQueryLength: number
): SearchResults<SearchResult> {
  // State rather than a ref. The ref had to be paired with a second piece of state
  // holding `new Date().valueOf()` to force the re-render, and two responses landing
  // in the same millisecond wrote the same value -- React bails out on an unchanged
  // state value, so the second response never reached the screen. It also meant
  // reading mutable state during render, which is what react-hooks/refs forbids.
  const [resultsContainer, setResultsContainer] = useState<
    ResultsContainer<SearchResult>
  >({});

  useEffect(() => {
    if (query.length < minQueryLength) return;
    if (resultsContainer[cacheKey(queryPath, query)] !== undefined) return;

    search<SearchResult>(queryPath, query).then(results => {
      // Nothing is cached for a request that came back empty-handed, so a failing
      // endpoint leaves the container identity alone. Storing `undefined` would read
      // back as "not fetched yet" and, since the container is an effect dependency,
      // would refetch forever.
      if (!results) return;
      setResultsContainer(container => ({
        ...container,
        [cacheKey(queryPath, query)]: results
      }));
    });
  }, [queryPath, query, minQueryLength, resultsContainer]);

  return bestResults(queryPath, query, resultsContainer);
}

// Keyed by endpoint as well as by text. Keying by text alone let one picker answer
// with another endpoint's results for the same word, and left `queryPath` out of the
// effect's dependencies to keep it that way.
function cacheKey(queryPath: string, query: string) {
  return `${queryPath} ${query}`;
}

async function search<SearchResult>(queryPath: string, query: string) {
  const data = await DuluAxios.get<{ results: SearchResult[] }>(queryPath, {
    q: query
  });
  if (data) {
    return data.results;
  }
}

function bestResults<SearchResult>(
  queryPath: string,
  query: string,
  resultsContainer: ResultsContainer<SearchResult>
): SearchResults<SearchResult> {
  for (let q = query; q.length > 0; q = q.slice(0, -1)) {
    const results = resultsContainer[cacheKey(queryPath, q)];
    if (results !== undefined) return { results, exact: q == query };
  }
  return { results: undefined, exact: false };
}
