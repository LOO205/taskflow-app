import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} type="button">
          ☰
        </button>
        <h1 className={styles.logo}>{title}</h1>
      </div>

      <div className={styles.right}>
        {user && <span className={styles.userName}>{user.name}</span>}
        {user && (
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => dispatch(logout())}
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}
