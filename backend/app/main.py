from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
import os

# Create FastAPI app
app = FastAPI(
    title="Image Optimization API",
    description="FastAPI + Cloudinary CDN Image Service",
    version="1.0.0"
)

# 🌐 CORS Configuration (Allow Angular frontend)
origins = [
    "http://localhost:4200",   # Angular dev
    "http://127.0.0.1:4200",
    # Add production frontend URL here
]

# ✅ Enable CORS (IMPORTANT for Angular)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔗 Include Routes
app.include_router(router, prefix="/api", tags=["Image API"])

# 🧪 Health Check
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "FastAPI Cloudinary Image Service Running 🚀"
    }

# ❤️ Readiness / Liveness (for Docker / Kubernetes)
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# 🔥 Optional: Startup Event (for logs / DB init)
@app.on_event("startup")
def startup_event():
    print("🚀 FastAPI server started")


# 🛑 Optional: Shutdown Event
@app.on_event("shutdown")
def shutdown_event():
    print("🛑 FastAPI server stopped")