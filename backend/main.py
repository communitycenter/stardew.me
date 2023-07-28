import os
import uuid
import boto3, botocore
from fastapi.middleware import Middleware
import uvicorn
import hashlib
import json

from io import BytesIO
from fastapi import FastAPI, Response
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from lib.models import Player
from lib.assets import loadAvatarAssets
from lib.renderer import CharacterRenderer
from lib.tools import get_sleeveless_shirts

load_dotenv()


def dict_hash(dictionary):
    """MD5 hash of a dictionary."""
    dhash = hashlib.md5()
    # We need to sort arguments so {'a': 1, 'b': 2} is
    # the same as {'b': 2, 'a': 1}
    encoded = json.dumps(dictionary, sort_keys=True).encode()
    dhash.update(encoded)
    return dhash.hexdigest()


s3 = boto3.client(
    "s3",
    endpoint_url=os.environ.get("r2"),
    aws_access_key_id=os.environ.get("r2_access"),
    aws_secret_access_key=os.environ.get("r2_secret"),
)


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

app = FastAPI(middleware=middleware)

assets = loadAvatarAssets()
sleeveless_shirts = get_sleeveless_shirts()


@app.options("/{path:path}", include_in_schema=False)
async def options_route(path: str):
    return {"message": "OK"}


@app.post("/avatar")
async def generate_image(player: Player):
    # BaseModels are not subscriptable so we need to convert to a dict
    player_dict = player.model_dump()

    # hash dict
    player_hash = dict_hash(player_dict)
    print(player_hash)

    # check if image exists in r2
    try:
        results = s3.head_object(Bucket="stardewclothing", Key=player_hash)
    except botocore.exceptions.ClientError as e:
        Avatar = CharacterRenderer(player_dict, assets, sleeveless_shirts)
        avatar = Avatar.render()

        bytesToUpload = BytesIO()

        avatar.save(bytesToUpload, "png")
        bytesToUpload.seek(0)

        # Upload to cloudflare
        upload = s3.put_object(
            Body=bytesToUpload.read(),
            Bucket="stardewclothing",
            Key=player_hash,
            ContentType="image/png",
        )

        if upload["ResponseMetadata"]["HTTPStatusCode"] == 200:
            return {
                "success": True,
                "url": f"{os.environ.get('r2_pub')}{player_hash}",
            }

        # avatar.save("test.png")
        return {"success": True}
    else:
        return {
            "success": True,
            "url": f"{os.environ.get('r2_pub')}{player_hash}",
        }


@app.get("/recent")
async def get_recent_generations():
    try:
        results = s3.list_objects_v2(Bucket="stardewclothing", MaxKeys=10)
        print(results)
    except botocore.exceptions.ClientError as e:
        return {"success": False, "error": e}
    else:
        return {
            "success": True,
            "recent": [
                f"{os.environ.get('r2_pub')}{x['Key']}"
                for x in sorted(
                    results["Contents"], key=lambda k: k["LastModified"], reverse=True
                )
            ],
        }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
