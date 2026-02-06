### Setup (Windows & Mac)
This project will use electron to facilitate startup normally, but for development, you can send messages stroight to FastAPI without having to use the front end code.

1. To start you need to make a .venv inside of the backend dir to install the dependencies. Do this with `python -m venv .venv`

3. Open a terminal window in the backend directory and depending on your operating system, enter the following command:
   * Windows: `./.venv/Scripts/activate`
   * MacOS: `source venv/bin/activate`

5. Now install dependencies with `pip install -r requirements.txt`

6. Now you are ready to run the python script. Run `uvicorn main:app --reload --port 8000`

7.  You may notice a problem, you might not have the key to use the API. This uses a google cloud vision OCR service key. Lookup how to make one, or ask Jake for his. You probably need to go to google clouds website, create a project, enable Cloud Vision, make a service account for that project, then select keys and generate one. DO NOT PUT ANY KEYS ON GITHUB. Git gaurdian will disable the key if you do. To use the key you need to set an envitoment variable with the path to the key (Windows) `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Path\To\Key"` The key should be downloaded from google as a json file
