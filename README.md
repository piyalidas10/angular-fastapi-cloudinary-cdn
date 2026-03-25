# angular-fastapi-cloudinary-cdn
CDN integration with Cloudinary in Angular 19 for Image Uploading & Optimization

Cloudinary is already a global CDN. My app just needs to use Cloudinary URLs correctly to benefit from it.

Without CDN:
```
User → Your server (India) → Image
```
With Cloudinary CDN:
```
User → nearest CDN edge (India / Singapore / etc.) → Image
```
👉 Result:
- ⚡ 3–10x faster load
- 🌍 global performance

## 🧠 Architecture (Signed Upload)
```
Angular App  ──► FastAPI (sign request) ──► Cloudinary
       │                                     ▲
       └────────────── upload ────────────────┘
```
👉 Backend only generates signature
👉 File goes directly to Cloudinary

## RUN Application
✅ 🔑 Step 1: Create / Login Account

Go to:
```
👉 https://cloudinary.com/
```
Sign up (free tier is enough) Or login if you already have account
<img src="imgs/cloudinary.png" width="100%" />

Create a .env file inside root folder. then copy credentials & add inside .env
```
CLOUDINARY_CLOUD_NAME='demo123'
CLOUDINARY_API_KEY='123456789012345'
CLOUDINARY_API_SECRET='abcdefg123456'
```

✅ Run Both Frontend & Backend via Docker
--------------------------------------------------------------------------------
Since you already have Dockerfile + docker-compose.yml 👇

**🚀 Run everything**
```
docker-compose down
docker-compose up --build
```

👉 This will:
- Start backend (FastAPI)
- Start frontend (Angular + NGINX)

**🌐 Run Frontend**
```
http://localhost:4200
```

<img src="imgs/run_application.png" width="100%" />
<img src="imgs/run_application_upload_img.png" width="100%" />
<img src="imgs/run_application_display_img_after_uploading.png" width="100%" />
<img src="imgs/cloudinary_img_store.png" width="100%" />

**🌐 Access backend**       
```
http://localhost:8000
```

**🔍 Test API**      
Open:
```
http://localhost:8000/docs
```
👉 Swagger UI (very useful)
<img src="imgs/test_api.png" width="100%" />

Two APIs will be triggered
1. http://localhost:8000/api/sign-upload (POST)
2. https://api.cloudinary.com/v1_1/dswtizsvv/image/upload (POST)

## 🧱 Full Project Structure
```
project-root/
│
├── docker-compose.yml
├── .env                // For cloudinary api_key & api_secret
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   │
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── routes.py
│       ├── cloudinary_service.py
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── angular.json
│   │
│   └── src/
│       ├── main.ts
│       ├── index.html
│       │
│       └── app/
│           ├── app.component.ts
│           ├── app.component.html
│           ├── app.component.scss
│           ├── optimized-image/
│               |──cloudinary.service.ts
│               |── optimized-image.component.ts
│               |── optimized-image.component.html
│               └── optimized-image.component.scss
│
└── README.md
```

## 🧠 Why node_modules is NOT in your frontend folder

You are running:
```
docker-compose up --build
```
👉 So:

- 📦 npm install runs inside Docker container
- ❌ NOT on your local machine
- 👉 That’s why you don’t see node_modules in frontend/

## 🔐 Why Signed Upload is Important
| Feature          | Unsigned            | Signed         |
| ---------------- | ------------------- | -------------- |
| Security         | ❌ Public abuse risk | ✅ Secure       |
| File control     | ❌ No validation     | ✅ Full control |
| Auth required    | ❌ No                | ✅ Yes          |
| Production ready | ❌                   | ✅              |


## ⚡ Pro Architecture Upgrade (What top companies do)
✅ Angular → Direct upload (Cloudinary CDN edge)    
✅ Backend → Only signature (lightweight)   

✅ Use transformations:
```
w_400,q_auto,f_auto
```
✅ Store only public_id in DB (not full URL)    

## 🧠 Why These Packages?
**requirements.txt inside backend folder**

| Package            | Purpose                  |
| ------------------ | ------------------------ |
| `fastapi`          | API framework            |
| `uvicorn`          | ASGI server              |
| `python-multipart` | File uploads             |
| `cloudinary`       | CDN + image optimization |
| `python-dotenv`    | Load `.env`              |
| `pydantic`         | Validation               |
| `httpx`            | External API calls       |

## npm ci vs npm install
| Command     | Requires package-lock.json? |
| ----------- | --------------------------- |
| npm ci      | ✅ YES                       |
| npm install | ❌ NO                        |

## Can we use Cloudinary with secure application like bank, retail, government?
Yes — Cloudinary can be used in secure applications (banking, retail, government), but not blindly. You must configure it with the right security controls and understand what data you’re putting there.

🏦 1. Is Cloudinary safe for high-security apps?
------------------------------------------------------------------------------------
Cloudinary is widely used in:
- fintech dashboards
- e-commerce platforms
- enterprise SaaS
- media platforms

👉 It supports:
- HTTPS delivery
- signed uploads
- access control
- CDN-level protection

✔ So technically YES, it is enterprise-ready


⚠️ 2. BUT — Critical Rule
------------------------------------------------------------------------------------
**❗ Never store sensitive data in raw form on Cloudinary**

**🚫 Avoid uploading:**
- Aadhaar / PAN images (without masking)
- bank statements
- confidential documents
- medical records
- classified government files

**👉 Because:**
- CDN = publicly accessible (by URL)
- even if “hard to guess”, still not zero-risk

✅ 3. When Cloudinary is SAFE to use
------------------------------------------------------------------------------------
**✔ Public / semi-public assets**
- product images (retail)
- profile pictures
- banners / marketing assets
- UI images
- thumbnails

**✔ Controlled access use cases**

If you enable:
- signed URLs
- authenticated delivery

👉 then it can be used for:
- invoices (temporary access)
- reports (expiring links)
- user uploads (controlled)

🔐 4. Security Features You MUST use
------------------------------------------------------------------------------------
**🔥 A. Signed Uploads (you already implemented)**
```
Frontend → Backend → Signature → Cloudinary
```
✔ prevents unauthorized uploads

**🔥 B. Signed URLs (VERY IMPORTANT)**
```
https://res.cloudinary.com/.../image/upload/s--signature--/...
```
👉 Only valid for limited time

**🔥 C. Authenticated Assets**

Cloudinary supports:
```
type=authenticated
```
👉 Requires token to access

**🔥 D. Expiring URLs**       
👉 Generate URLs that expire in minutes/hours

**🔥 E. Folder-based access control**
```
/private/
/secure/
```
🧠 5. Banking / Government Architecture (REALISTIC)
------------------------------------------------------------------------------------
**In high-security systems:**
```
User → App Server → Secure Storage (S3 / private storage)
                  ↓
         Cloudinary (ONLY for processed/optimized/public assets)
```
**👉 Sensitive originals:**
- stored in private storage
- NOT directly exposed via CDN

🏗️ 6. Hybrid Architecture (BEST PRACTICE)
------------------------------------------------------------------------------------
```
Sensitive Image → S3 (private)
              ↓
      Backend processes
              ↓
    Cloudinary (optimized version)
              ↓
        Angular UI
```

🔐 7. Compliance Considerations
------------------------------------------------------------------------------------
For banking / govt:
- GDPR
- ISO 27001
- SOC 2

👉 Cloudinary supports many standards       
BUT your architecture must also comply

| Use Case                 | Cloudinary?          |
| ------------------------ | -------------------- |
| Product images           | ✅ YES                |
| User profile pics        | ✅ YES                |
| Marketing assets         | ✅ YES                |
| Sensitive financial docs | ⚠️ With restrictions |
| Classified govt data     | ❌ Avoid direct CDN   |


