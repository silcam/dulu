export default class Cluster {
  static compare(a, b) {
    return a.name.localeCompare(b.name);
  }

  static clusterParams(cluster) {
    return {
      name: cluster.name,
      language_ids: cluster.languages.map(language => language.id)
    };
  }
}
