import os
import uuid
import boto3
import uvicorn

from io import BytesIO
from fastapi import FastAPI
from dotenv import load_dotenv

from lib.models import Player
from lib.assets import loadAvatarAssets
from lib.renderer import CharacterRenderer

load_dotenv()

s3 = boto3.client(
    "s3",
    endpoint_url=os.environ.get("r2"),
    aws_access_key_id=os.environ.get("r2_access"),
    aws_secret_access_key=os.environ.get("r2_secret"),
)

app = FastAPI()
assets = loadAvatarAssets()


@app.post("/generate_image")
async def generate_image(player: Player):
    # BaseModels are not subscriptable so we need to convert to a dict
    player_dict = player.model_dump()

    Avatar = CharacterRenderer(player_dict, assets)
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

    # avatar.save("test.png")
    return {"success": True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
