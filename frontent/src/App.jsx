import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for new project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Form state for new task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  // Fetch Projects & Tasks
  const fetchData = useCallback(() => {
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/projects/'),
      axios.get('http://127.0.0.1:8000/api/tasks/')
    ])
      .then(([projectsRes, tasksRes]) => {
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        if (projectsRes.data.length > 0 && !selectedProject) {
          setSelectedProject(projectsRes.data[0].id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data from Django API:', error);
        setLoading(false);
      });
  }, [selectedProject]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Form Submit to create a new Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    axios.post('http://127.0.0.1:8000/api/projects/', {
      title: projectTitle,
      description: projectDescription
    })
      .then(() => {
        setProjectTitle('');
        setProjectDescription('');
        fetchData();
      })
      .catch(error => {
        console.error('Error creating project:', error.response?.data || error.message);
      });
  };

  // Handle Form Submit to create a new Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProject) return;

    axios.post('http://127.0.0.1:8000/api/tasks/', {
      title: taskTitle,
      description: taskDescription,
      project: Number(selectedProject),
      completed: false
    })
      .then(() => {
        setTaskTitle('');
        setTaskDescription('');
        fetchData();
      })
      .catch(error => {
        console.error('Error creating task:', error.response?.data || error.message);
      });
  };

  // Toggle Task Completion Status
  const toggleTaskCompletion = (task) => {
    axios.patch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
      completed: !task.completed
    })
      .then(() => {
        fetchData();
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    if (!window.comfirm && !confirm("Are you sure you want to delete this project?")) return;

    axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then(() => {
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting project:', error);
      });
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`)
      .then(() => {
        fetchData();
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>🚀 ProjectPulse Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Manage your projects and tasks seamlessly with Django & React</p>
      </header>

      {/* Forms Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Create Project Form */}
        <section style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e1e8ed' }}>
          <h3>➕ Create Project</h3>
          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Project Title" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)} 
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <textarea 
              placeholder="Description" 
              value={projectDescription} 
              onChange={(e) => setProjectDescription(e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', height: '40px' }}
            />
            <button 
              type="submit" 
              style={{ padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Add Project
            </button>
          </form>
        </section>

        {/* Create Task Form */}
        <section style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e1e8ed' }}>
          <h3>📝 Create Task</h3>
          <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)} 
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input 
              type="text" 
              placeholder="Task Description" 
              value={taskDescription} 
              onChange={(e) => setTaskDescription(e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button 
              type="submit" 
              style={{ padding: '8px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Add Task
            </button>
          </form>
        </section>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading dashboard data...</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Projects Section */}
          <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>📂 Projects ({projects.length})</h2>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map(project => (
                  <li key={project.id} style={{ background: 'white', margin: '10px 0', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #3498db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>{project.title}</h3>
                      <p style={{ margin: 0, color: '#555' }}>{project.description}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        style={{ padding: '6px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Tasks Section */}
          <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>📝 Tasks ({tasks.length})</h2>
            {tasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map(task => (
                  <li key={task.id} style={{ background: 'white', margin: '10px 0', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #2ecc71', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                      <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{task.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button 
                        onClick={() => toggleTaskCompletion(task)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          background: task.completed ? '#d4edda' : '#fff3cd',
                          color: task.completed ? '#155724' : '#856404'
                        }}
                      >
                        {task.completed ? 'Completed' : 'Pending'}
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ padding: '6px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;