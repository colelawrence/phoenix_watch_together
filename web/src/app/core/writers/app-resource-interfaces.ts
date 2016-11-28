
import * as R from '../../shared/read';

export
interface User_userjson {
  id: number
  first_name: string
}

export
function User(u: User_userjson) {
  return <R.User> {
    Id: u.id,
    Name: u.first_name,
  }
}

export
interface Group_groupjson {
  id: number
  name: string
  listed: number
  // currently playing proposal
	group_video_proposal?: GroupVideoProposal_group_video_proposaljson
  group_users: GroupUser_group_userjson[]
  is_playing: boolean
  started_at?: string
  paused_at?: number
}
export
function Group(g: Group_groupjson, users: User_userjson[]) {
  const getUser = (id) => users.find(u => u.id == id)

  let Users: R.User[] =
      g.group_users
      .map(({user_id})=>getUser(user_id))
      .map(User)

  return <R.Group> {
    Id: String(g.id),
    Name: g.name,
    Users: Users,

    Playing: g.group_video_proposal ? VideoVote(g.group_video_proposal, false) : null,

		State: g.is_playing ? 'play' : 'pause', 
    PlayStartedAt: g.started_at,
    PausePlayerAt: g.paused_at,
  }
}

export
interface GroupUser_group_userjson {
  group_id: number
  user_id: number
}

export
interface Message_messagejson {
  id: number
  body: string
  user_id: number
}
export
function GroupMessage(m: Message_messagejson, users: User_userjson[]) {
  const getUser = (id) => users.find(u => u.id == id)

  return <R.GroupMessage> {
    Id: m.id,
    User: User(getUser(m.user_id)),
    Text: m.body,
    Date: new Date()
  }
}

export
interface Video_videojson {
	id: number
  yt_id: string
  name: string
  description: string
  thumb: string
}
export
function Video(v: Video_videojson) {
  return <R.Video> {
    Id: v.id,
    YT_Id: v.yt_id,
    Name: v.name,
    ThumbnailURL: v.thumb
  }
}

export
interface GroupVideoProposal_group_video_proposaljson {
  id: number
  score: number
  group_id: number
  user_id: number
  video: Video_videojson
}
export
function VideoVote(gvp: GroupVideoProposal_group_video_proposaljson, hasVote: boolean) {
  return <R.VideoVote> {
    ProposalId: gvp.id,
    Video: Video(gvp.video),
		VoteCount: gvp.score,
		HasVote: hasVote,
  }
}