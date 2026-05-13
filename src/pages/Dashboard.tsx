import { useState, useCallback, memo } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import useProjects, { type Project } from '../hooks/useProjects';
import styles from './Dashboard.module.css';

const MemoizedSidebar = memo(Sidebar);

export default function Dashboard() {
  const {
    projects,
    columns,
    loading,
    error,
    saving,
    addProject,
    renameProject,
    deleteProject,
  } = useProjects();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const handleRename = useCallback(
    (project: Project) => {
      void renameProject(project);
    },
    [renameProject]
  );

  const handleDelete = useCallback(
    (id: string) => {
      void deleteProject(id);
    },
    [deleteProject]
  );

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className={styles.layout}>
      <Header title="TaskFlow" onMenuClick={() => setSidebarOpen((p) => !p)} />

      <div className={styles.body}>
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
          onDelete={handleDelete}
        />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={async (name, color) => {
                  await addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
