import { useState } from "react";
import AddJobs from "./AddJobs";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AddJobs></AddJobs>
    </>
  );
}

export default App;
