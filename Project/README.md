# White Springs Ranch - File Upload & OCR Application

A desktop application for secure file uploads with optical character recognition (OCR). Built with Angular, Electron, and Python FastAPI. Uses Google Cloud Vision (or optional local OCR) to extract text from images and export to Word documents.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 21 |
| Desktop | Electron 40 |
| Backend | Python FastAPI, Uvicorn |
| OCR | Google Cloud Vision API |

---

## Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- **Python** 3.8+ — [Download](https://www.python.org/)
- **Google Cloud** account with Vision API enabled (billing required)

Verify installations:

```bash
node --version
npm --version
python --version
```

---

## Project Structure

```
Project/
├── main.js                 # Electron main process
├── package.json            # Node dependencies & scripts
├── angular.json            # Angular config
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── components/
│   │   │   └── file-upload/
│   │   ├── app.ts
│   │   └── app.config.ts
│   └── main.ts
├── python/                 # FastAPI backend
│   ├── main.py             # OCR API
│   ├── requirements.txt
│   └── venv/               # Created on first run
└── README.md
```

---

## Installation

### 1. Clone and enter the project

```bash
cd White-Springs-Ranch-Project/Project
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Python virtual environment

The `start:python` script creates and uses a venv automatically. For manual setup:

```bash
cd python
python -m venv venv

# Windows
venv\Scripts\activate
pip install -r requirements.txt

# Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Google Cloud setup (for OCR)

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the [Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com)
3. [Enable billing](https://console.cloud.google.com/billing) (free tier: ~1,000 images/month)
4. Create a service account key and set:

   ```bash
   # Windows
   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-service-account-key.json

   # Mac/Linux
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
   ```

---

## Development

### Run everything (recommended)

From the `Project` directory:

```bash
npm run electron:dev
```

This starts:

- Angular dev server → `http://localhost:4200`
- Python FastAPI backend → `http://127.0.0.1:8000`
- Electron desktop window

### Run components separately

**Terminal 1 – Angular:**

```bash
npm run start:frontend
```

**Terminal 2 – Python:**

```bash
npm run start:python
```

**Terminal 3 – Electron:**

```bash
npm run start:electron
```

### Test the OCR API

```powershell
# Windows PowerShell
curl.exe -X POST http://127.0.0.1:8000/ocr -F "file=@path\to\your\image.jpg"
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ocr` | Upload image, returns `ocr_result.docx` |

**Accepted file types:** JPG, GIF, TIFF, SVG, PS, PDF (size limits in frontend validation).

---

## Configuration

- **Backend port:** `python/main.py` (uvicorn) and `src/app/components/file-upload/file-upload.component.ts` (`apiUrl`)
- **Upload directory:** `python/main.py` — `OUTPUT_DIR`
- **CORS origins:** `python/main.py` — `allow_origins`

---

## Contributing

We welcome contributions. Please follow these guidelines.

### Getting started

1. **Fork the repository** (or create a branch if you have direct access).
2. **Clone your fork** and create a branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

### Branch naming

- `feature/` — new features (e.g. `feature/add-pdf-support`)
- `fix/` — bug fixes (e.g. `fix/upload-timeout`)
- `docs/` — documentation (e.g. `docs/update-readme`)

### Before submitting

1. **Run the app** and verify your changes:

   ```bash
   npm run electron:dev
   ```

2. **Format code:**
   - TypeScript/JavaScript: project uses Prettier (`printWidth: 100`, `singleQuote: true`)
   - Python: use `black` or follow PEP 8

3. **Test manually** — upload an image and confirm OCR works as expected.

### Submitting changes

1. **Commit** with clear messages:

   ```bash
   git add .
   git commit -m "feat: add support for PNG images"
   ```

2. **Push** your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** against `main`:
   - Describe what changed and why
   - Reference any related issues
   - Add screenshots for UI changes if applicable

### Code style

- **Angular/TypeScript:** Use strict typing; avoid `any` where possible.
- **Python:** Type hints preferred. Use `async`/`await` for FastAPI endpoints.
- **Formatting:** Run Prettier before committing; keep Python consistent with existing style.

### Areas for contribution

- Local OCR option (e.g. Tesseract) for users without Google Cloud
- Additional file format support
- Error handling and user feedback improvements
- Documentation and troubleshooting guides

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm run electron:dev` fails | Run from the `Project` directory, not the repo root |
| `ModuleNotFoundError: google.cloud` | Ensure `start:python` uses the venv, or run `pip install -r python/requirements.txt` in the venv |
| 403 from Vision API | Enable billing for your Google Cloud project |
| Port 8000 in use | Stop other processes using 8000, or change the port in both backend and frontend |
| Electron window doesn’t open | Check terminal for errors; ensure Angular compiles successfully first |

---

## License

Copyright © 2026 White Springs Ranch Project
