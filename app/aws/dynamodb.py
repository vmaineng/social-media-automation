import boto3, uuid, os
from datetime import datetime

dynamo = boto3.resource(
    'dynamodb',
      region_name=os.getenv('AWS_REGION', 'AWS_REGION')
      )
table = dynamo.Table(os.getenv("DYNAMO_DB_NAME"))

def save_status(text: str, user_id: str, image_url:Optional[str] = None, metadata: Optional[dict] = None):
    status_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    table.put_item(Item={
        'statusId': status_id,
        'userId': user_id,
        'text': text,
        'imageUrl': image_url,
        'createdAt': created_at,
        'updatedAt': created_at,
    })

    if metadata:
        item['metadata'] = metadata
    
    try:
        response = table.put_item(
            Item=item,

        )
        return status_id
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        raise ValueError('Status ID already exists')
    except Exception as e:
        raise Exception(f"Failed to save status: {str(e)}")

    return status_id