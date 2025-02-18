import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
    const router = useRouter();

    const isActive = (path) => router.pathname === path;

    return (
        <div className={styles.navContainer}>
            <div className={styles.sideNav}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoText}>Finance<span>Track</span></span>
                    </Link>
                </div>
                <nav className={styles.navLinks}>
                    <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                        <span className={styles.icon}>📊</span>
                        <span className={styles.linkText}>Dashboard</span>
                    </Link>
                    <Link href="/transactions" className={`${styles.navItem} ${isActive('/transactions') ? styles.active : ''}`}>
                        <span className={styles.icon}>💰</span>
                        <span className={styles.linkText}>Transactions</span>
                    </Link>
                    <Link href="/analytics" className={`${styles.navItem} ${isActive('/analytics') ? styles.active : ''}`}>
                        <span className={styles.icon}>📈</span>
                        <span className={styles.linkText}>Analytics</span>
                    </Link>
                    <Link href="/EditTransactionForm" className={`${styles.navItem} ${isActive('/EditTransactionForm') ? styles.active : ''}`}>
                        <span className={styles.icon}>✏️</span>
                        <span className={styles.linkText}>Edit Form</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Navbar; 