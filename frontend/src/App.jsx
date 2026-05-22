import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [dbStatus, setDbStatus] = useState({
    mongo: "",
    mysql: "",
  });

  useEffect(() => {

    const fetchPing = async () => {
      try {

        const response = await axios.get(
          "http://localhost:5000/api/ping"
        );

        setDbStatus(response.data);

      } catch (error) {

        console.log(error);

        setDbStatus({
          mongo: "Error",
          mysql: "Error",
        });
      }
    };

    fetchPing();

  }, []);

  return (
    <div style={{ padding: "30px" }}>

      <h1>E-Commerce Mini Store</h1>

      <h2>Database Status</h2>

      <p>
        MongoDB:
        <strong> {dbStatus.mongo}</strong>
      </p>

      <p>
        MySQL:
        <strong> {dbStatus.mysql}</strong>
      </p>

    </div>
  );
}

export default App;