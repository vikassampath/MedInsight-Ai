# MedInsight AI

MedInsight AI is a full-stack starter for an intelligent medical report and imaging assistant. The current slice is a frontend dashboard with demo health measurements, report history, a report upload interaction, a knowledge assistant interaction, and an always-visible safety layer.

## Current scope

- React + TypeScript + Vite dashboard
- FastAPI backend with `GET /api/health`
- PostgreSQL + pgvector Docker Compose service definition
- Clear separation between educational context and diagnosis
- Responsive layout for desktop and narrow screens

The displayed measurements and assistant answer are demo data. No uploaded file is transmitted or analyzed yet.

![Continuous integration](https://github.com/vikassampath/MedInsight-Ai/actions/workflows/ci.yml/badge.svg)

## Run the frontend

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## Run the API

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

Health check: `http://localhost:8000/api/health`

## Start PostgreSQL with pgvector

```powershell
docker compose up -d
```

## Planned implementation slices

1. OCR extraction with lab-provided ranges and confidence metadata.
2. Report persistence, patient history, and trend queries.
3. Medical image inference with model versioning and Grad-CAM artifacts.
4. Trusted-source RAG with citations, retrieval logs, and answer uncertainty.
5. Authentication, consent, encryption, retention controls, and clinical safety review.

This project is not a medical device and must not be used for diagnosis or emergency decisions. Emergency symptoms should be directed to local emergency services or a qualified clinician.
