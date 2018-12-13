export default class Cluster {
  static compare(a, b) {
    return a.name.localeCompare(b.name);
  }
}
