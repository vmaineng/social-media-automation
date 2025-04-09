from fastapi import FastAPI, UploadFile, Form
from aws.dynamodb import save_status
from aws.s3 import upload_image_to_s3

app = FasatAPI()

@app.post('/api/post-status')
async def post_status(text: str = Form(...), user_id: str = Form(...), image: UploadFile = None):
    image_url = None
    if image:
        content = await image.read()
        image_url = upload_image_to_s3(content, image.filename)
    status_id = save_status(text, user_id, image_url)
    return {"status": "success", "statusId": status_id}