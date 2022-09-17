import { useEffect, useState } from "react";
import styles from "./Main.module.scss";

export default function Main() {
  const [data, setData] = useState<any[]>([]);

  // get data from "http://localhost:8000/items")
  useEffect(() => {
    fetch("http://localhost:8000/items")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const postData = () => {
    fetch("http://localhost:8000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 7,
        name: "item1",
        price: 11.5,
      }),
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => {
        fetch("http://localhost:8000/items")
          .then((res) => res.json())
          .then((data) => setData(data));
      });
  };

  return (
    <div className={styles.main}>
      <h1>Items</h1>
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={postData}>Post Data</button>
    </div>
  );
}
