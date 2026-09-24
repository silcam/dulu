// Ambient declaration for webpack's asset modules, which turn an image import into the
// URL the bundler emits for it. One file uses this (NavBar's logo); it is declared here
// rather than inline so the next image import does not have to rediscover it.
declare module "*.png" {
  const url: string;
  export default url;
}
