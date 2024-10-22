import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import FileDownload from './views/download';
import FileUpload from './views/upload';

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>Ummm.... I did this to share files, its kinda whack, but it kinda works.</p>
      <p>Oh yea, files last for 24 hours, then they will become kaboom, no more.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/about" element={<About />} />
        <Route path="/file/:id" element={<FileDownload />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;