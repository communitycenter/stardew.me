import sys
from fastapi import FastAPI
import requests
from io import BytesIO
import json
import boto3
import uvicorn
import uuid
import os
from dotenv import load_dotenv
from lib.tools import createPlayer
from lib.recolors import CharacterRenderer

load_dotenv()

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ.get("r2"),
    aws_access_key_id=os.environ.get("r2_access"),
    aws_secret_access_key=os.environ.get("r2_secret"),
)

app = FastAPI()


@app.get("/generate_image")
async def generate_image():
    file_path = "./saves/clem"
    player = createPlayer(file_path)
    Avatar = CharacterRenderer(player)
    avatar = Avatar.render()

    bytesToUpload = BytesIO()

    avatar.save(bytesToUpload, "png")
    bytesToUpload.seek(0)

    uuidKey = str(uuid.uuid4())

    # Upload to cloudflare
    upload = s3.put_object(
        Body=bytesToUpload.read(),
        Bucket="stardewclothing",
        Key=uuidKey,
        ContentType="image/png",
    )

    if upload["ResponseMetadata"]["HTTPStatusCode"] == 200:
        return {
            "success": True,
            "url": f"{os.environ.get('r2_pub')}{uuidKey}",
        }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
