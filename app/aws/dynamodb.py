import boto3, uuid, os
from datetime import datetime

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.getenv("Social_Media_Posts"))

def save_status(text: str, user_id: str, image_url: str = None):
    status_id = str(uuid.uuid4())
    table.put_item(Item={
        'statusId': status_id,
        'userId': user_id,
        'text': text,
        'imageUrl': image_url,
        'createdAt': datetime.utcnow().isoformat()
    })

    return status_id