export const eventGlobal = $state({
  dices: undefined,
  message: "",
  send(dices, message="") {
    this.dices = dices;
    this.message = message;
  }
});