import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Nav";
import Tweets from "./pages/Tweets";
import Users from "./pages/Users";
import TweetPage from "./pages/Tweet";

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<div>404</div>} />

          <Route path="/register" element={<Register />} />
          <Route path="/tweets" element={<Tweets />} />

          <Route path="/tweets/:id" element={<TweetPage />} />

          <Route path="/users" element={<Users />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
