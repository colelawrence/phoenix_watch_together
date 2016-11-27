
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
const ajax = require('axios');

const URL = 'https://www.googleapis.com/youtube/v3/search';

interface RawResultVideoItem {
  kind: string, // "youtube#searchResult",
  etag: string, // "\"5C5HHOaBSHC5ZXfkrT4ZlRCi01A/j0uEstXCXOhrDqDegEBmEeHqsBM\"",
  id: {
    kind: string, // "youtube#video",
  	videoId: string, // "YQHsXMglC9A"
  },
  snippet: {
    publishedAt: string, // "2015-10-23T06:54:18.000Z",
    channelId: string, // "UComP_epzeKzvBX156r6pm1Q",
    title: string, // "Adele - Hello",
    description: string, // "'Hello' is taken from the new album, 25, out November 20. http://adele.com Available now from iTunes http://smarturl.it/itunes25 Available now from Amazon ...",
    thumbnails: {
      default: {
        url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/default.jpg",
        width: 120, height: 90 },
      medium: {
        url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg",
        width: 320, height: 180 },
      high: {
        url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg",
        width: 480, height: 360 }
    },
    channelTitle: string, // "AdeleVEVO",
    liveBroadcastContent: string, // "none"
	}
}

export
interface ResultVideoItem {
  title: string,
  desc: string,
	yt_id: string,
  thumbnails: {
    default: {
      url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/default.jpg",
      width: 120, height: 90 },
    medium: {
      url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg",
      width: 320, height: 180 },
    high: {
      url: string, // "https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg",
      width: 480, height: 360 }
  },
}

@Injectable()
export class YoutubeAPIService {
  private stateObserver: Observer<ResultVideoItem[]>

  public state: Observable<ResultVideoItem[]>

  constructor() {
    this.state = Observable.create(observer => {
      this.stateObserver = observer
      // Any cleanup logic might go here
      return () => console.log('disposed youtube search service')
    });
  }

  search (options: {key: string, query: string, maxResults?: number}) {
    let params = {
      key: options.key,
      q: options.query,
      maxResults: options.maxResults || 10,
      part: 'snippet',
      type: 'video',
      videoEmbeddable: "true",
    };

    ajax.get(URL, { params })
      .then((response) => {
        let raw_items = <RawResultVideoItem[]> response.data.items
        this.next(raw_items.map(v => {
          return {
            title: v.snippet.title,
            desc: v.snippet.description,
            yt_id: v.id.videoId,
            thumbnails: v.snippet.thumbnails,
          }
        }))
      })
      .catch((response) => {
        console.error(response)
      })    
  }

  private next(state) {
    this.stateObserver.next(state)
  }
}
