from typing import Optional
from datetime import datetime

class Post:
    def __init__(self, post_id: str, status_text: str, x_post_result: Optional[dict], bsky_post_result: Optional[dict], timestamp: datetime):
        self.post_id = post_id
        self.status_text = status_text
        self.x_post_result = x_post_result
        self.bsky_post_result = bsky_post_result
        self.timestamp = timestamp