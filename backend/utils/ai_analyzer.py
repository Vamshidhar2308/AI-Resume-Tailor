import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_final_resume(resume_text, job_description):
    prompt = f"""
You are an expert ATS resume writer.

Create a final polished resume tailored to the job description.

Goal:
The final resume should be highly optimized for the job description and target an ATS match score of 95% or higher, while staying truthful.

STRICT RULES:
- Never invent companies.
- Never invent job titles.
- Never invent dates.
- Never invent degrees.
- Never invent certifications.
- Never invent fake work experience.
- Never invent metrics or percentages unless they already exist in the resume.
- You may add technologies from the job description ONLY if they are logically supported by the resume projects, skills, coursework, or existing experience.
- If a missing technology is not supported by the resume, do not add it as experience.
- Improve the resume by applying ATS recommendations directly into the final resume.
- Strengthen the Professional Summary.
- Expand project bullet points using relevant job description keywords.
- Reorganize skills to match the job description.
- Use strong ATS-friendly section headings.
- Do not include ATS score.
- Do not include missing skills.
- Do not include suggestions.
- Do not explain what changed.
- Return only the final resume.

Resume:
{resume_text}

Job Description:
{job_description}

Final resume format:

Name:
Contact:
Professional Summary:
Technical Skills:
Projects:
Education:
Certifications:
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content or ""


def generate_ats_report(resume_text, job_description):
    prompt = f"""
You are an ATS resume analyst.

Analyze the resume against the job description.

STRICT RULES:
- Do not rewrite the full resume.
- Do not invent experience.
- Do not invent skills.
- Clearly separate missing skills from existing skills.
- Give honest ATS feedback.

Resume:
{resume_text}

Job Description:
{job_description}

Return the report in this format:

ATS Match Score:
Missing Skills:
Strengths:
Weaknesses:
Keyword Coverage:
ATS Suggestions:
Changes Recommended:
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content or ""