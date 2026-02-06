# White Springs Ranch - File Upload Application

A desktop application built with Angular, Electron, and Python FastAPI for secure file uploads.


## Prerequisites (dev)

### Required
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python** (3.8 or higher) - [Download](https://www.python.org/)
- **pip** (comes with Python)

### Verify installations
```bash
node --version
npm --version
python --version
pip --version
```



## Project Structure

```
white-springs-ranch/Project
├── electron.js              # Electron main process
├── package.json             # Node.js dependencies and scripts
├── angular.json             # Angular configuration
├── src/                     # Angular frontend source
│   ├── app/
│   │   ├── components/
│   │   │   └── file-upload/
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   └── app.config.ts
│   └── main.ts
├── python/                  # Python backend
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
└── README.md


## Development

### Option 1: Run Everything Together

- Install electron `npm install --save-dev electron` 

```bash
npm run electron:dev
```

This SHOULD open Electron desktop window, but it does not. Thats on the fix list.  

This single command:
- ✅ Starts Angular dev server (`http://localhost:4200`)
- ✅ Create a .venv if you dont have one, or activate your pre existing one.
- ✅ Starts Python FastAPI backend (`http://127.0.0.1:8000`)
- ✅ Enables hot reload for both Angular and Python


To test python, run:
`
curl.exe -X POST `
  http://127.0.0.1:8000/ocr `
  -F "file=@C:\Users\jkchu\dev\White-Springs-Ranch-Project\Project\Sample-Images\goodsample2.jpg" `
`
(The backticks are important for windows), Linux/Mac you need to use a different command. Look in souce
file if the backticks arent showing up in readme because of markdown format.

### Option 2: Run Components Separately (For Debugging)

Useful when you need to debug specific parts or restart individual services.

**Terminal 1 - Angular:**
```bash
ng serve
```

**Terminal 2 - Python Backend:**

Start venv (instructions above)

```bash
cd python
python -m uvicorn main:app --reload --port 8000
```

**Terminal 3 - Electron:** (not working currently)

Electron on its own does nothing.  

Windows CMD:
```bash
set NODE_ENV=development
npm run electron
```

Mac/Linux/PowerShell:
```bash
export NODE_ENV=development
npm run electron
```

