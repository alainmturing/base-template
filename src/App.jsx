import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

// Dynamically import all model components
const modelImports = import.meta.glob('./tasks/*/*.jsx');

// Extract unique task IDs from the file paths
const taskIds = Array.from(
  new Set(
    Object.keys(modelImports).map((path) => {
      const parts = path.split('/');
      return parts[2]; // Assuming './tasks/{taskId}/component.jsx'
    })
  )
);

// Helper to dynamically load a component
const loadComponent = (taskId, componentName) => {
  const path = `./tasks/${taskId}/${componentName}.jsx`;
  const importFunc = modelImports[path];
  if (!importFunc) {
    return null;
  }
  return lazy(importFunc);
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    color: '#333',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '60vh',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '300px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    display: 'block',
    transition: 'background-color 0.3s',
  },
  backLink: {
    marginTop: '20px',
    textDecoration: 'none',
    color: '#6c757d',
  },
};

const Home = () => (
  <div style={styles.container}>
    <h1 style={styles.heading}>Tasks</h1>
    <ul style={styles.list}>
      {taskIds.map((taskId) => (
        <li key={taskId} style={styles.listItem}>
          <Link to={`/tasks/${taskId}`} style={styles.link}>{taskId}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Task = () => {
  const { taskId } = useParams();
  const components = ['modelA', 'modelB', 'ideal'];
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Task: {taskId}</h2>
      <ul style={styles.list}>
        {components.map((comp) => (
          <li key={comp} style={styles.listItem}>
            <Link to={`/tasks/${taskId}/${comp}`} style={styles.link}>{comp}</Link>
          </li>
        ))}
      </ul>
      <Link to="/" style={styles.backLink}>Back to Tasks</Link>
    </div>
  );
};

const TaskComponent = () => {
  const { taskId, componentName } = useParams();
  const Component = loadComponent(taskId, componentName);
  if (!Component) {
    return (
      <div style={styles.container}>
        <h3 style={styles.heading}>Component not found.</h3>
        <Link to={`/tasks/${taskId}`} style={styles.backLink}>Back to Task</Link>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>{componentName}</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
      <Link to={`/tasks/${taskId}`} style={styles.backLink}>Back to Task</Link>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks/:taskId" element={<Task />} />
      <Route path="/tasks/:taskId/:componentName" element={<TaskComponent />} />
      <Route
        path="*"
        element={
          <div style={styles.container}>
            <h2 style={styles.heading}>Page Not Found</h2>
            <Link to="/" style={styles.backLink}>Go to Home</Link>
          </div>
        }
      />
    </Routes>
  </Router>
);

export default App;