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
  YTApiKey: string

  Groups?: Group[]

  OpenGroup?: OpenGroup
}

export
interface Group {
  Id: string
  Name: string
  Users: User[]
  Playing?: Video
  StartedAt?: number
}

export
interface OpenGroup {
  Group: Group,
  Messages: GroupMessage[]
  ModalOpen: "vote-video" | "add-video" | null
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
  ProposalId: number
  Video: Video
  VoteCount: number
  HasVote: boolean
}

export
interface Video {
  Id: number,
  YT_Id: string
  Name: string
  Desc?: string
  // default thumbnail url
  ThumbnailURL?: SafeResourceUrl
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
