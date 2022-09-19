from cgitb import reset
import csv
import codecs
from unittest import removeResult
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dataArray = []
# verify if there are duplicate content in row 'nome', if so, remove the duplicate and keep the first one


def removeDuplicate(dataArray):
    for i in range(len(dataArray)):
        for j in range(i+1, len(dataArray)):
            if dataArray[i]['nome'] == dataArray[j]['nome']:
                dataArray.pop(j)
    return dataArray


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload")
def upload(file: UploadFile = File(...)):
    csvReader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    data = {}
    for rows in csvReader:
        key = rows['Id']  # Assuming a column named 'Id' to be the primary key
        data[key] = rows

    file.file.close()
    prt = os.path.dirname(os.path.abspath(__file__))
    dataArray.append(data)

# get the data from csv file received from frontend and save it to a txt file


@app.post("/save")
def save(file: UploadFile = File(...)):
    csvReader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    data = {}
    for rows in csvReader:
        key = rows['Id']  # Assuming a column named 'Id' to be the primary key
        data[key] = rows

    file.file.close()
    prt = os.path.dirname(os.path.abspath(__file__))
    with open(prt + '/data.txt', 'w') as outfile:
        outfile.write(str(data))
    return data


@app.get("/data")
def get_data():
    # content is like: {'1': {'Id': '1', 'Name': 'John', 'Age': '20'}, '2': {'Id': '2', 'Name': 'Peter', 'Age': '21'}}, so we need to convert it to a list
    content = dataArray[0]
    content_list = []
    for key in content:
        content_list.append(content[key])
    removeDuplicate(content_list)
    return content_list


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
