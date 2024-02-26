import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      {/* {Here insert the correspond nested componentes depending on the URL} */}
      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyrigth {new Date().getFullYear()} by Worldwise Inc.
        </p>
      </footer>
    </div>
  );
}
