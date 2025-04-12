import tweepy
import logging
from typing import Optional

class XService:
    def __init__(self, api_key: str, api_secret: str, access_token: str, access_token_secret: str):
        auth = tweepy.OAuthHandler(api_key, api_secret)
        auth.set_access_token(access_token, access_token_secret)
        self.client = tweepy.API(auth)
        self.logger = logging.getLogger(__name__)

    def post_status(self, status_text: str) -> Optional[dict]:
        try:
            x_status = self.client.update_status(status=status_text)
            self.logger.info(f"Posted to X: {x_status.id}")
            return {
                'id': x_status.id,
                'url': f"https://twitter.com/{x_status.user.screen_name}/status/{x_status.id}"
            }
        except tweepy.TweepyException as e:
            self.logger.error(f"Error posting to X: {e}")
            return {'error': str(e)}