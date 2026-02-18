import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath, format } from 'url';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
let mainWindow;
let pythonProcess;

function startPythonProcess() {
  const projectRoot = __dirname;
  const pythonBackendPath = join(projectRoot, 'python');

  // Prefer venv Python so google.cloud and other deps are available
  const venvPythonWin = join(pythonBackendPath, 'venv', 'Scripts', 'python.exe');
  const venvPythonUnix = join(pythonBackendPath, 'venv', 'bin', 'python');
  const hasVenvWin = process.platform === 'win32' && existsSync(venvPythonWin);
  const hasVenvUnix = process.platform !== 'win32' && existsSync(venvPythonUnix);

  const pythonCommand = hasVenvWin
    ? venvPythonWin
    : hasVenvUnix
      ? venvPythonUnix
      : process.platform === 'win32'
        ? 'python'
        : 'python3';

  const appModule = 'main:app';
  const port = 8000;

  console.log('Starting Python backend with uvicorn...');
  console.log('Python:', pythonCommand);

  const uvicornArgs = [
    '-m', 'uvicorn',
    appModule,
    '--host', '127.0.0.1',
    '--port', port.toString()
  ];

  if (process.env.NODE_ENV === 'development') {
    uvicornArgs.push('--reload');
  }

  pythonProcess = spawn(pythonCommand, uvicornArgs, {
    cwd: pythonBackendPath
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    pythonProcess = null;
  });

  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python process:', error);
  });
}

function stopPythonProcess() {
  if (pythonProcess) {
    console.log('Stopping Python process...');
    pythonProcess.kill();
    pythonProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // Development: load from Angular dev server
    mainWindow.loadURL('http://localhost:4200');
    
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    mainWindow.loadURL(
      format({
        pathname: join(__dirname, 'dist/frontend/browser/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
    stopPythonProcess();
  });
}

app.on('ready', () => {
  if (!process.env.SKIP_PYTHON_SPAWN) {
    startPythonProcess();
  }
  createWindow();
});

app.on('window-all-closed', function () {
  stopPythonProcess();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopPythonProcess();
});