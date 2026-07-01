"use client";

import { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  ShieldCheck,
  Target,
  Sparkles,
  CloudDownload,
  Briefcase,
  BarChart3,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateResume = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and paste the job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-tailored-resume",
        formData,
      );

      setResult(response.data);
    } catch (error) {
      alert("Something went wrong. Check backend terminal.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-8 py-24">
        <div className="text-center mb-20">
          <h1 className="mb-10 text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-slate-950">AI Resume </span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Tailor
            </span>
          </h1>

          <p className="mt-6 mb-20 text-2xl text-slate-600">
            Upload your resume and generate an ATS-friendly tailored resume.
          </p>
        </div>

        <div className="rounded-[34px] bg-white/95 p-12 md:p-16 shadow-2xl border border-white">
          <div className="mb-20">
            <div className="mb-10 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <Upload size={30} />
              </div>
              <h2 className="text-3xl font-extrabold">Upload Resume</h2>
            </div>

            <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-blue-500 bg-blue-50/40 px-8 py-8">
              <div className="flex items-center gap-6">
                <FileText className="text-blue-600" size={34} />
                <span className="text-lg font-bold">Choose file</span>
                <span className="h-8 w-px bg-slate-300" />
                <span className="text-lg text-slate-800">
                  {file ? file.name : "No file selected"}
                </span>
              </div>

              <span className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-bold text-white shadow-lg">
                Browse
              </span>

              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          <div className="mb-20">
            <div className="mb-10 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <Briefcase size={30} />
              </div>
              <h2 className="text-3xl font-extrabold">Paste Job Description</h2>
            </div>

            <textarea
              rows="8"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="mt-6 w-full resize-none rounded-2xl border-2 border-emerald-400 bg-white/90 p-8 text-xl text-slate-900 shadow-inner outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={generateResume}
            disabled={loading}
            className="flex w-full items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 py-7 text-2xl font-extrabold text-white shadow-xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles />
            {loading
              ? "Generating your ATS Resume..."
              : "Generate Tailored Resume"}
          </button>

          {result && (
            <div className="mt-20 rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <CheckCircle className="text-emerald-500" size={38} />
                <h2 className="text-3xl font-extrabold">
                  Resume Generated Successfully
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-8 shadow">
                  <ShieldCheck className="mb-4 text-purple-600" size={40} />
                  <p className="font-bold text-lg">ATS Score</p>
                  <p className="text-5xl font-extrabold text-purple-600">
                    {result.ats_score}%
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow">
                  <Target className="mb-4 text-emerald-600" size={40} />
                  <p className="font-bold text-lg">Keyword Match</p>
                  <p className="text-5xl font-extrabold text-emerald-600">
                    {result.keyword_match}%
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow">
                  <Sparkles className="mb-4 text-orange-500" size={40} />
                  <p className="font-bold text-lg">Missing Skills</p>
                  <p className="text-5xl font-extrabold text-orange-500">
                    {result.missing_skills}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <a
                  href={result.final_resume_url}
                  target="_blank"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-6 text-xl font-extrabold text-white shadow-lg"
                >
                  <CloudDownload />
                  Download Final Resume
                </a>

                <a
                  href={result.ats_report_url}
                  target="_blank"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-6 text-xl font-extrabold text-white shadow-lg"
                >
                  <CloudDownload />
                  Download ATS Report
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-4">
          <Feature
            icon={<ShieldCheck size={46} />}
            title="ATS Friendly"
            text="Optimized for ATS systems"
            color="text-purple-600"
            bg="bg-purple-50"
          />
          <Feature
            icon={<Target size={46} />}
            title="Keyword Match"
            text="Better match with job descriptions"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <Feature
            icon={<BarChart3 size={46} />}
            title="AI Powered"
            text="Advanced AI for better results"
            color="text-orange-500"
            bg="bg-orange-50"
          />
          <Feature
            icon={<CloudDownload size={46} />}
            title="Download"
            text="Get resume & ATS report"
            color="text-blue-600"
            bg="bg-blue-50"
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text, color, bg }) {
  return (
    <div className={`rounded-3xl ${bg} border border-white p-8 shadow-lg`}>
      <div className={`${color} mb-6`}>{icon}</div>
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="mt-4 text-lg text-slate-600">{text}</p>
    </div>
  );
}
