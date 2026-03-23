import cloudinary
import cloudinary.utils
import time
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

def generate_signature(public_id: str):
    timestamp = int(time.time())

    params_to_sign = {
        "timestamp": timestamp,
        "public_id": public_id,
        "folder": "myapp_uploads"   # ✅ ADD HERE
    }

    signature = cloudinary.utils.api_sign_request(
        params_to_sign,
        os.getenv("CLOUDINARY_API_SECRET")
    )

    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "public_id": public_id,
        "folder": "myapp_uploads"   # ✅ ALSO RETURN TO FRONTEND
    }