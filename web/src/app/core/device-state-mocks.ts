
import * as R from '../shared/read';

const cloneDeep = <(obj: any) => any> require('lodash.clonedeep');

let now1: Date = new Date()

const ua0 = { Name: "Speedy Gonzalez" }

const v0 = { Name: "Luigi iz Hot 0", URL: "SFBnhaXql24" }
const v1 = { Name: "Luigi iz H1", URL: "SFBnhaXql24" }
const v2 = { Name: "Luigi i2", URL: "SFBnhaXql24" }
const v3 = { Name: "Getting fucked up 3", URL: "SFBnhaXql24" }
const v4 = { Name: "4 iz Hot", URL: "SFBnhaXql24" }
const v5 = { Name: "5 iz Hot", URL: "SFBnhaXql24" }

const ua1 = { Name: "Tom Cat" }
const ua2 = { Name: "Jerry Mouse" }
const ua3 = { Name: "Tweety Bird" }
const ua4 = { Name: "Sylvester Cat" }
const ua5 = { Name: "Foghorn Leghorn" }

const skipVotes1: R.SkipVote = {
	HasVote: false,
	VoteCount: 2
}

const vv0: R.VideoVote = { Id: "0", HasVote: true, VoteCount: 2, Video: v5 }
const vv1: R.VideoVote = { Id: "1", HasVote: false, VoteCount: 2, Video: v1 }
const vv2: R.VideoVote = { Id: "2", HasVote: false, VoteCount: 0, Video: v2 }
const vv3: R.VideoVote = { Id: "3", HasVote: true, VoteCount: 2, Video: v3 }
const vv4: R.VideoVote = { Id: "4", HasVote: true, VoteCount: 2, Video: v4 }

const videoVotes1: R.VideoVote[] = [ vv0, vv1, vv2, vv3, vv4 ]

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
  },

  GroupOpened: <R.DeviceState> {
    HasLoggedIn: true,
    LoggedIn: {
      User: ua0,
      Group: {
				Playing: v0,
        Users: [
          ua1, ua2, ua3, ua4, ua5
        ],
        Messages: [
          { Date: ahm(now1, 0, 0), Text: "Right on!", User: ua0 },
          { Date: ahm(now1, 0, -1), Text: "Does fuck you sound good?", User: ua4 },
          { Date: ahm(now1, 0, -5), Text: "The weather is great", User: ua4 },
          { Date: ahm(now1, 0, -5), Text: "I'm interested!", User: ua3 },
          { Date: ahm(now1, 0, -7), Text: "The park sounds fun", User: ua2 },
          { Date: ahm(now1, 0, -10), Text: "Let's go to the park!", User: ua0 }, // You
          { Date: ahm(now1, 0, -13), Text: "What is everyone feeling like doing", User: ua1 },
          { Date: ahm(now1, 0, -13), Text: "Hello Everyone", User: ua1 },
        ],
        ModalOpen: null,
        VideoVotes: videoVotes1,
        SkipVote: skipVotes1,
      }
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

// adjust hours and minutes
function ahm(d: Date, h: number, m: number): Date {
  const n = new Date(d.valueOf())
  n.setHours(d.getHours() + h)
  n.setMinutes(d.getMinutes() + m)
  return n
}