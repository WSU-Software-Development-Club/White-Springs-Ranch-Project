const { app, BrowserWindow } = require("electron")
const { spawn } = require("child_process")
const path = require("path")

let pyProcess = null
let mainWindow = null

function startPython() {
  return new Promise((resolve, reject) => {
    pyProcess = spawn("python", ["backend/main.py"], {
      cwd: path.join(__dirname, ".."),
    })

    pyProcess.stdout.on("data", data => {
      console.log(`PY: ${data}`)
      // Resolve once Python prints anything (signals it's ready)
      resolve()
    })

    pyProcess.stderr.on("data", data => {
      console.error(`PY ERR: ${data}`)
    })

    pyProcess.on("error", err => {
      console.error("Failed to start Python:", err)
      reject(err)
    })

    pyProcess.on("close", code => {
      console.log(`Python exited with code ${code}`)
    })

    // Fallback: resolve after 2s even if no stdout
    setTimeout(resolve, 2000)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  mainWindow.loadURL("http://localhost:4200")

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  await startPython()
  createWindow()

  // macOS: re-create window when clicking the dock icon
  app.on("activate", () => {
    if (mainWindow === null) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (pyProcess) {
    pyProcess.kill()
    pyProcess = null
  }
  app.quit()
})