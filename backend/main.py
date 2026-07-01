import os
import shutil

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from core.config import UPLOAD_FOLDER
from services.resume_service import generate_resume_package
from utils.resume_parser import extract_text
from utils.ai_analyzer import generate_ats_report


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Tailor 🚀"}


@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(file_path)
    ai_analysis = generate_ats_report(resume_text, job_description)

    return {
        "message": "Resume analyzed successfully",
        "filename": file.filename,
        "ai_analysis": ai_analysis
    }


@app.post("/generate-tailored-resume")
async def generate_tailored_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    return generate_resume_package(file, job_description)


@app.get("/download/final/{filename}")
def download_final_resume(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Final resume not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@app.get("/download/report/{filename}")
def download_ats_report(filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="ATS report not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )