import json
import os
import boto3
import tweepy
from atproto import Client
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
posts_table = dynamodb.Table(os.environ['POSTS_TABLE'])

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        status_text = body.get('statusText')

        if not status_text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing statusText'})
            }

        x_api_key = os.environ['X_API_KEY']
        x_api_secret = os.environ['X_API_SECRET']
        x_access_token = os.environ['X_ACCESS_TOKEN']
        x_access_token_secret = os.environ['X_ACCESS_TOKEN_SECRET']
        x_auth = tweepy.OAuthHandler(x_api_key, x_api_secret)
        x_auth.set_access_token(x_access_token, x_access_token_secret)
        x_client = tweepy.API(x_auth)

        bsky_client = Client()
        bsky_username = os.environ['BSKY_USERNAME']
        bsky_password = os.environ['BSKY_PASSWORD']
        bsky_client.login(bsky_username, bsky_password)

        x_post_result = None
        bsky_post_result = None

        try:
            x_status = x_client.update_status(status=status_text)
            x_post_result = {
                'id': x_status.id,
                'url': f"https://twitter.com/{x_status.user.screen_name}/status/{x_status.id}"
            }
            print(f"Posted to X: {x_post_result['url']}")
        except tweepy.TweepyException as e:
            print(f"Error posting to X: {e}")
            x_post_result = {'error': str(e)}

        try:
            bsky_post = bsky_client.post.create(repo=bsky_client.me.did, content={'text': status_text})
            bsky_post_result = {'uri': bsky_post.uri}
            print(f"Posted to Bluesky: {bsky_post_result['uri']}")
        except Exception as e:
            print(f"Error posting to Bluesky: {e}")
            bsky_post_result = {'error': str(e)}

        timestamp = datetime.utcnow().isoformat()
        post_id = timestamp
        try:
            posts_table.put_item(
                Item={
                    'postId': post_id,
                    'statusText': status_text,
                    'xPostResult': x_post_result,
                    'bskyPostResult': bsky_post_result,
                    'timestamp': timestamp
                }
            )
            print(f"Stored post in DynamoDB with ID: {post_id}")
        except Exception as e:
            print(f"Error storing in DynamoDB: {e}")
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'Failed to store post: {e}'})
            }

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'postId': post_id,
                'xPostResult': x_post_result,
                'bskyPostResult': bsky_post_result
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {e}'})
        }