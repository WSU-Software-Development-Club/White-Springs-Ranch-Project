const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function startPythonProcess() {
  // Path to your Python backend directory
  const pythonBackendPath = path.join('python');
  
  // For uvicorn, we need to run it as a module
  // Adjust the app path based on your FastAPI/ASGI app structure
  // Example: if you have python/main.py with app = FastAPI(), use 'main:app'
  const appModule = 'main:app';  // Change this to match your FastAPI app
  const port = 8000;  // Change this to your desired port

  console.log('Starting Python backend with uvicorn...');
  console.log('Backend path:', pythonBackendPath);

  // Run uvicorn
  // For development: uvicorn main:app --reload --port 8000
  // For production: uvicorn main:app --port 8000
  const uvicornArgs = [
    '-m', 'uvicorn',
    appModule,
    '--host', '127.0.0.1',
    '--port', port.toString()
  ];

  // Add --reload for development
  if (process.env.NODE_ENV === 'development') {
    uvicornArgs.push('--reload');
  }

  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

  pythonProcess = spawn(pythonCommand, uvicornArgs, {
    cwd: pythonBackendPath  // Set working directory to python folder
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
      url.format({
        pathname: path.join(__dirname, 'dist/frontend/browser/index.html'),
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
  startPythonProcess();
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