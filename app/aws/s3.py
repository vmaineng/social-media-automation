import boto3, uuid, os

s3 = boto3.client('s3')

def upload_image_to_s3(file_content: bytes, filename: str) -> str: 
    bucket = os.getenv('social-media-mv')
    key = f"images/{uuid.uuid4()}_{filename}"
    s3.put_object(Bucket=bucket, Key=key, Body=file_content)
    return f"https://{bucket}.s3.amazonaws.com/{key}"