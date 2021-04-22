import Fab from '@material-ui/core/Fab'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add'
import Canvas from './Canvas'

import styles from './Main.module.css'

export default function Main() {
  return (
    <Container className={styles.container}>
      <div className={styles.drawingArea}>
        <Canvas />
      </div>
      <div className={styles.buttonContainer}>
        <Fab variant='extended' color='secondary'>
          <AddIcon />
          New Squiggle
        </Fab>
      </div>
    </Container>
  )
}
