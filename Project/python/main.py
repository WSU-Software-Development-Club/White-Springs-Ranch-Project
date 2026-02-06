from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from google.cloud import vision
from docx import Document
import uuid
import os

app = FastAPI()
client = vision.ImageAnnotatorClient()

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/ocr")
async def ocr_image(file: UploadFile = File(...)):
    image_bytes = await file.read()

    image = vision.Image(content=image_bytes)
    response = client.text_detection(image=image)

    text = response.full_text_annotation.text

    doc = Document()
    doc.add_paragraph(text)

    filename = f"{uuid.uuid4()}.docx"
    filepath = os.path.join(OUTPUT_DIR, filename)
    doc.save(filepath)

    return FileResponse(
        path=filepath,
        filename="ocr_result.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
