export const eventGlobal = $state({
  rng: undefined,
  message: "",
  send(rng, message="") {
    this.rng = rng;
    this.message = message;
  }
});