import styles from './App.module.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1>Squiggler</h1>
        <h2>Kickstart Creativity</h2>
      </div>
      <div className={styles.leftSidebar}><Sidebar /></div>
      <div className={styles.main}><Main /></div>
    </div>
  )
}
