import json
import os
import boto3
import tweepy
from atproto import Client
from datetime import datetime
import logging

# DynamoDB setup
dynamodb = boto3.resource('dynamodb')
posts_table = dynamodb.Table(os.environ['POSTS_TABLE'])

# Logging setup
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # 1. Get status text from request
        # IMPORTANT:  Process the event correctly to get form data.
        if event.get('body'):
            try:
                body = json.loads(event['body'])
                status_text = body.get('postText')
            except json.JSONDecodeError:
                # Handle the case where the body is not JSON (e.g., form data)
                #  This is crucial for handling FormData from the browser
                status_text = event['body'].split('statusText=')[1].split('&')[0]
                status_text = status_text.replace('+', ' ')
                logger.info(f"status_text from form data: {status_text}")

        else:
            status_text = None

        if not status_text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing statusText'})
            }

        # 2. Authenticate with social APIs (use environment variables)
        # X API
        x_api_key = os.environ['X_API_KEY']
        x_api_secret = os.environ['X_API_SECRET']
        x_access_token = os.environ['X_ACCESS_TOKEN']
        x_access_token_secret = os.environ['X_ACCESS_TOKEN_SECRET']
        x_auth = tweepy.OAuthHandler(x_api_key, x_api_secret)
        x_auth.set_access_token(x_access_token, x_access_token_secret)
        x_client = tweepy.API(x_auth)

        # Bluesky API
        bsky_client = Client()
        bsky_username = os.environ['BSKY_USERNAME']
        bsky_password = os.environ['BSKY_PASSWORD']
        bsky_client.login(bsky_username, bsky_password)

        # 3. Post to social APIs and store results
        x_post_result = None
        bsky_post_result = None

        try:
            x_status = x_client.update_status(status=status_text)
            x_post_result = {
                'id': x_status.id,
                'url': f"https://twitter.com/{x_status.user.screen_name}/status/{x_status.id}"
            }
            logger.info(f"Posted to X: {x_post_result['url']}")
        except tweepy.TweepyException as e:
            logger.error(f"Error posting to X: {e}")
            x_post_result = {'error': str(e)}  # Store error, don't raise

        try:
            bsky_post = bsky_client.post.create(repo=bsky_client.me.did, content={'text': status_text})
            bsky_post_result = {'uri': bsky_post.uri}
            logger.info(f"Posted to Bluesky: {bsky_post_result['uri']}")
        except Exception as e:
            logger.error(f"Error posting to Bluesky: {e}")
            bsky_post_result = {'error': str(e)}  # Store error, don't raise

        # 4. Store in DynamoDB
        timestamp = datetime.utcnow().isoformat()
        post_id = timestamp  # Use timestamp as a unique ID
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
            logger.info(f"Stored post in DynamoDB with ID: {post_id}")
        except Exception as e:
            logger.error(f"Error storing in DynamoDB: {e}")
            # Consider whether to fail the whole operation or just log
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'Failed to store post: {e}'})
            }

        # 5. Return response to frontend
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
        logger.error(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {e}'})
        }