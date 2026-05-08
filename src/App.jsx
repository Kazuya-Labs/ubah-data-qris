import { BrowserRouter, Routes, Route } from "react-router-dom";
import GenerateQris from "./modules/generate-qris/GenerateQris";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/generate-qris" element={<GenerateQris />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
