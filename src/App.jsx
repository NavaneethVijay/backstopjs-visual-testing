import { Routes, Route } from "react-router-dom"
import Home from './routes/index.jsx'
import ReportApp from './routes/ReportApp.jsx'

export default function App() {
  return (
    <Routes>
    <Route path="/" element={ <Home/> } />
    <Route path="/reports/:viewport/:website" element={ <ReportApp/> } />
  </Routes>
  );
}
