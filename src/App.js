import styles from './App.module.css'
import AppBar from '@material-ui/core/AppBar';
import Main from './components/Main'

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <AppBar color='primary'>Squiggler</AppBar>
      </div>
      <div className={styles.main}><Main /></div>
    </div>
  )
}
