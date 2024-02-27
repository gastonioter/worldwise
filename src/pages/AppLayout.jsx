import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import Maps from "../components/Map";
import User from "../components/User";
export default function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Maps />
      <User />
    </div>
  );
}
