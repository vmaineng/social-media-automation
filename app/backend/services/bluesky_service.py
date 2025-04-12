from atproto import Client
import logging
from typing import Optional

class BlueskyService:
    def __init__(self, username: str, password: str):
        self.client = Client()
        self.client.login(username, password)
        self.logger = logging.getLogger(__name__)

    def create_post(self, status_text: str) -> Optional[dict]:
        try:
            bsky_post = self.client.post.create(repo=self.client.me.did, content={'text': status_text})
            self.logger.info(f"Posted to Bluesky: {bsky_post.uri}")
            return {'uri': bsky_post.uri}
        except Exception as e:
            self.logger.error(f"Error posting to Bluesky: {e}")
            return {'error': str(e)}