from fastapi import APIRouter
from pydantic import BaseModel
from app.cloudinary_service import generate_signature

router = APIRouter()

class SignRequest(BaseModel):
    public_id: str

@router.post("/sign-upload")
def sign_upload(req: SignRequest):
    return generate_signature(req.public_id)