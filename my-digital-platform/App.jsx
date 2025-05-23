import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ImportExcel from "./pages/ImportExcel";
import DataTable from "./pages/DataTable";
import { DataProvider } from "./context/DataContext";

const App = () => (
  <DataProvider>
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/import" element={<ImportExcel />} />
          <Route path="/data" element={<DataTable />} />
        </Routes>
      </div>
    </Router>
  </DataProvider>
);

export default App;