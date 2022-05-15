from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import cv2
import numpy as np
from server.api import segments


origins = [
    "http://localhost:6006"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_root():
    return "Hello, World!"


@app.post("/api/v1/segments")
async def post_v1_segments(files: List[UploadFile] = File(...)):
    '''Segmentation API (V1)

    Arguments:
        files: Images
    '''
    results = []
    for file in files:
        data = await file.read()
        src = cv2.imdecode(
            np.asarray(bytearray(data), dtype=np.uint8),
            cv2.IMREAD_COLOR
        )
        results.append([seg.to_dict() for seg in segments(src)])
    return JSONResponse(results)
