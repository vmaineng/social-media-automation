# tests/test_s3.py
import os
import boto3
from moto import mock_aws
from s3_client import upload_image_to_s3

@mock_aws
def test_upload_image_to_s3():
    # Arrange
    os.environ["S3_BUCKET_NAME"] = 'test-bucket'
    s3 = boto3.client("s3", region_name="us-west-2")
    s3.create_bucket(
    Bucket="test-bucket",
    CreateBucketConfiguration={"LocationConstraint": "us-west-2"}
)

    file_content = b"fake image data"
    filename = "test.png"
    
    # Act
    url = upload_image_to_s3(file_content, filename)

    # Assert
    assert "test-bucket.s3.amazonaws.com" in url
    objects = s3.list_objects_v2(Bucket="test-bucket")
    assert "Contents" in objects
    assert any(obj["Key"].endswith(filename) for obj in objects["Contents"])
