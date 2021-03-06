import * as TwitterAPI from 'twitter'
import config from './config'
import i18n from './i18n'

const api = new TwitterAPI({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
})

export interface User {
  id: number
  id_str: string
  name: string
  screen_name: string
  lang: string
  profile_image_url: string
  profile_image_url_https: string
}

export interface Tweet {
  created_at: string
  id: number
  id_str: string
  text: string
  source: string
  truncated: boolean
  in_reply_to_status_id?: number
  in_reply_to_status_id_str?: string
  in_reply_to_user_id?: number
  in_reply_to_user_id_str?: string
  in_reply_to_screen_name?: string
  user: User
  retweeted_status?: Tweet
  display_text_range?: object
}

export class Twitter {

  public static async trackTweet(keyword: string) {
    const stream = await api.stream('statuses/filter', { track: keyword })
    return stream
  }

  public static async getUser(obj: { screenName: string} ): Promise<User|null> {
    const result = await api.get('users/lookup', { screen_name: obj.screenName })
    if (result && result.length > 0) {
      return result[0] as User
    } else {
      return null
    }
  }

  public static async postTweet({ locale, phrase, data, replyTo }: { locale: string, phrase: string, data?: any, replyTo?: string }): Promise<Tweet> {
    const result = await api.post('statuses/update', {
      status: i18n.__({ phrase: phrase, locale: locale }, data),
      in_reply_to_status_id: replyTo
    })
    return result as Tweet
  }

  public static async postFavorite(obj: { id: string} ): Promise<Tweet> {
    const result = await api.post('favorites/create', { id: obj.id })
    return result as Tweet
  }

}
