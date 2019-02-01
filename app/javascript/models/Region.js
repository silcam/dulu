export default class Region {
  static compare(a, b) {
    return a.name.localeCompare(b.name);
  }

  static regionParams(region) {
    return {
      name: region.name,
      person_id: region.person ? region.person.id : undefined,
      cluster_ids: region.clusters.map(cluster => cluster.id),
      language_ids: region.languages.map(language => language.id)
    };
  }
}
