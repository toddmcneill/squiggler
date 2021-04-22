import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Canvas from './Canvas'

import styles from './Main.module.css'

export default function Main() {
  return (
    <div className={styles.main}>
      <div className={styles.drawingArea}>
        <Fab variant='extended' color='secondary'>
          <AddIcon />
          New Squiggle
        </Fab>
        <Canvas />
      </div>
    </div>
  )
}
