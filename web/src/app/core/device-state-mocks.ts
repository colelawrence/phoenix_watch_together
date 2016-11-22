
import * as R from '../shared/read';

const cloneDeep = <(obj: any) => any> require('lodash.clonedeep');

const States = <{[key: string]: R.DeviceState}> {

  // Although not necessary to throw this `R.DeviceState` cast here,
  // It makes our lives easier if a single mock state is incorrect.
  NotLoggedIn: <R.DeviceState> {
    HasLoggedIn: false,
    NotLoggedIn: {
      HasLoggedOutShown: false
    }
  },

  LoggedOut: <R.DeviceState> {
    HasLoggedIn: false,
    NotLoggedIn: {
      HasLoggedOutShown: true
    }
  },

  LoginError: <R.DeviceState> {
    HasLoggedIn: false,
    NotLoggedIn: {
      HasLoggedOutShown: false,
      LoginError: "Connection to facebook could not be established"
    }
  }
}

export function getState(id: string): R.DeviceState {
  return cloneDeep(States[id])
}

export const StateKeys = (() => {
  let res: string[] = [], key
  for (key in States) {
    res.push(key)
  }
  return res
})();
