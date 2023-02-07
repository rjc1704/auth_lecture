import { BrowserRouter, Routes, Route } from "react-router-dom";
import SessionPage from "./pages/SessionPage";
import TokenPage from "./pages/TokenPage";
function App() {
  //////
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SessionPage />} />
        <Route path="/token" element={<TokenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
