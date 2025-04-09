import boto3, os

s3 = boto3.client('s3')

def upload_image_to_s3(file_content: bytes, filename: str) -> str: 
    bucket = os.getenv('S3_BUCKET_NAME')
    if not bucket:
        raise ValueError("missing S3_Bucket_name")
    
    s3 = boto3.client("s3")
    key = f"images/{filename}"
    s3.put_object(Bucket=bucket, Key=key, Body=file_content)
    return f"https://{bucket}.s3.amazonaws.com/{key}"