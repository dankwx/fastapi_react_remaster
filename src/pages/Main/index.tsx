import { useEffect, useState } from "react";
import styles from "./Main.module.scss";

export default function Main() {
  const [data, setData] = useState<any[]>([]);

  function UploadCsv() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event: any) => {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    };

    const handleSubmission = () => {
      if (!isFilePicked) {
        alert("Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile!);

      fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        // refresh data
        .then(() => {
          fetch("http://localhost:8000/data")
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setData(data);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    return (
      <div>
        <input type="file" accept=".csv" onChange={changeHandler} />
        <div>
          <button onClick={handleSubmission}>Upload</button>
        </div>
      </div>
    );
  }
  // get data from 'localhost:8000/data'
  useEffect(() => {
    fetch("http://localhost:8000/data")
      .then((response) => response.json())
      .then((data) => {
        // convert the object to array
        setData(Object.values(data));
        console.log(data.type);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className={styles.main}>
      <h1>Enter CSV file:</h1>
      <UploadCsv />
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>nome</th>
            <th>idade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dataArray, key) => (
            // have unique key
            <tr key={key.toString()}>
              <td>{dataArray.Id}</td>
              <td>{dataArray.nome}</td>
              <td>{dataArray.idade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
