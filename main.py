from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from algorithms import bubble_sort, binary_search, insertion_sort, selection_sort

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

class ArrayRequest(BaseModel):
    array: list[int]
    target: int | None = None

class BinarySearchRequest(BaseModel):
    array: list[int]
    target: int

@app.post("/api/bubble-sort")
def run_bubble_sort(req: ArrayRequest):
    steps = bubble_sort(req.array)
    return {"steps": steps}

@app.post("/api/selection-sort")
def run_selection_sort(req: ArrayRequest):
    return {"steps": selection_sort(req.array)}

@app.post("/api/insertion-sort")
def run_insertion_sort(req: ArrayRequest):
    return {"steps": insertion_sort(req.array)}

@app.post("/api/binary-search")
def run_binary_search(req: BinarySearchRequest):
    sorted_arr = sorted(req.array)
    steps = binary_search(sorted_arr, req.target)
    return {"sorted_array": sorted_arr, "steps": steps}