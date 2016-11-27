
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
	video?: Video_videojson
  group_users: GroupUser_group_userjson[]
  started_at?: Date // TODO
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
    Playing: g.video ? Video(g.video) : null,
    StartedAt: null, // TODO
  }
}

export
interface GroupUser_group_userjson {
  group_id: number
  user_id: number
}

export
interface Video_videojson {
	id: number
  yt_id: string
  name: string
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
  yt_id: string
  score: number
  group_id: number
  user_id: number
}
export
function VideoVote(gvp: GroupVideoProposal_group_video_proposaljson, hasVote: boolean) {
  return <R.VideoVote> {
    ProposalId: gvp.id,
    Video: {
      Id: null,
      Name: null,
      YT_Id: gvp.yt_id,
    },
		VoteCount: gvp.score,
		HasVote: hasVote,
  }
}