#!/bin/sh
gunicorn app:app -b 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker