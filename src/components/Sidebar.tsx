import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  projects,
  isOpen,
  onRename,
  onDelete,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>

      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <NavLink
                to={`/projects/${p.id}`}
                className={({ isActive }) =>
                  `${styles.item} ${isActive ? styles.active : ''}`
                }
                style={{ flex: 1 }}
              >
                <span className={styles.dot} style={{ background: p.color }} />
                {p.name}
              </NavLink>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button type="button" onClick={() => onRename(p)}>✏️</button>
                <button type="button" onClick={() => onDelete(p.id)}>🗑️</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}