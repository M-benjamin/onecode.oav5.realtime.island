export default class Magic {
  constructor() {
    this.magicPlayers = []
  }

  addMagicPlayer(id, name, room) {
    const player = {
      id,
      name,
      room,
      score: 0,
    }
    this.magicPlayers.push(player)
    return player
  }

  getPlayer(id) {
    return this.magicPlayers.filter(player => player.id === id)[0]
  }

  removePlayer(id) {
    const player = this.getPlayer(id)

    if (player) {
      this.magicPlayers = this.magicPlayers.filter(player => player.id !== id)
    }

    return player
  }

  generateRandomNumber() {
    const random = Math.floor(Math.random() * 1337 + 1)
    return random
  }

  getPlayerList(room) {
    console.log(room)
    console.log(this.magicPlayers)

    const players = this.magicPlayers.filter(player => player.room === room)

    return players
  }
}
