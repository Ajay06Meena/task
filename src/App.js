import './App.css';
import ProfilePage from './components/ProfilePage';
import UserListPage from './components/UserListPage';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<UserListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
