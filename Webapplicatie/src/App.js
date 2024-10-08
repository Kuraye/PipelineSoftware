import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import PoseValidation from './routes/PoseValidation';
import WebcamPose from './routes/WebcamPose';

function App() {
  return (
    <BrowserRouter>
      <>
        <nav style={{
          display: 'flex',
          height: '3rem',
          background: '#000',
          marginBottom: '2em',
        }}>
          <Link style={{ color: '#fff', padding: '1rem' }} to="/">WebcamPose</Link>
          <Link style={{ color: '#fff', padding: '1rem' }} to="/pose-validation">PoseValidation</Link>
        </nav>
        <Routes>
          <Route index element={<WebcamPose />} />
          <Route path='/pose-validation' element={<PoseValidation />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
