/**
 * DeviceState stores all the information about the device at a specific time.
 * If you are able to pass in a device state, you should be able to completely
 * display the application without any additional calls aside from resources.
 *
 * This DeviceState can be updated incrementally via ordered events.
 * This allows us to separate the events and results into the same place,
 * simplifying UI testing and scaffolding.
 *
 * See CQRS Zine https://schneide.wordpress.com/2016/09/02/a-zine-for-the-modern-developer/
 */
import { SafeResourceUrl } from '@angular/platform-browser'

export
type LanguageType  = "FR" | "EN" |"CH" | "ES"

export
interface DeviceState {
  // required
  HasLoggedIn?: boolean

  NotLoggedIn?: NotLoggedIn
  LoggedIn?: LoggedIn

  Language?: LanguageType
}

export
interface NotLoggedIn {
  // 3.1
  LastLogin?: Date
  LoginError?: string
  // required
  HasLoggedOutShown?: boolean
}

export
interface LoggedIn {
  // required
  User?: User
  Credentials?: FacebookAuth

  Group?: Group
}

export
interface Group {
  Playing: Video
  Users: User[]
  Messages: GroupMessage[]
  ModalOpen: "video" | null
  VideoVotes: VideoVote[]
  SkipVote: SkipVote
}

export
interface SkipVote {
  VoteCount: number
  HasVote: boolean
}

export
interface VideoVote {
  Id: string
  Video: Video
  VoteCount: number
  HasVote: boolean
}

export
interface Video {
  Name: string
  URL: string
}

export
interface User {
  Name: string
  ProfilePicture?: SafeResourceUrl
  // Gender?: 'm' | 'f' | 'u' // may use later
}

export
interface GroupMessage {
  User: User
  Text: string
  Date: Date
}

export
interface FacebookAuth {
  AccessToken: string
  ExpiresIn: number
  SessionKey: boolean
  Signature: string
  UserID: string
}
