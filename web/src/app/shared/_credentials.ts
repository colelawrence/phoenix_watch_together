// DEPRECATED


type Whitelist = string
type Image = {toResourceURL(): string }


export class Credentials {
  static ID = 0
  private _id: number
  private _whitelists: Whitelist[]
  constructor(private _name: string) {
    this._id = Credentials.ID
    Credentials.ID += 1

    // whitelists are mocked for now
    this._whitelists = [
      ["Alpha Chi Omega"],
      [],
      ["Scholars House"],
      ["Scholars House", "Tri Sigma"],
    ][this._id] || [];
  }

  isEqual(creds: Credentials): boolean {
    return creds._id === this._id;
  }

  getImage(): Image {
    return {
      toResourceURL: () => <string> require('raw!../../stub-data/img/mitch-hedberg.png.txt')
    }
  }

  getFirstName(): string {
    return this._name.split(' ')[0]
  }

  getLastName(): string {
    return this._name.split(' ')[1]
  }

  isWhitelisted(): boolean {
    return this.getWhitelists().length !== 0;
  }

  getWhitelists(): Whitelist[] {
    return this._whitelists
  }

  // Only used for mocking
  setWhitelists(whitelists: Whitelist[]) {
    this._whitelists = whitelists
  }
}
