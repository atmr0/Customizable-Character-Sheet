export const eventGlobal = $state({
  rng: undefined,
  send(rng) {
    this.rng = rng;
  }
});