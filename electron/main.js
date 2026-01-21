const { app, BrowserWindow } = require("electron")
const { spawn } = require("child_process")
const path = require("path")

let pyProcess = null

function startPython() {
  pyProcess = spawn("python", ["backend/main.py"], {
    cwd: path.join(__dirname, ".."),
  })

  pyProcess.stdout.on("data", data => {
    console.log(`PY: ${data}`)
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })

  win.loadURL("http://localhost:4200")
}

app.whenReady().then(() => {
  startPython()
  createWindow()
})

app.on("window-all-closed", () => {
  if (pyProcess) pyProcess.kill()
  app.quit()
})
