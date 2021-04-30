import { useRef, useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import Controls from './Controls'
import suggestions from '../suggestions.json'
// import RotateRightIcon from '@material-ui/icons/RotateRight'
import Drawing from './Drawing'
import styles from './Main.module.css'

export default function Main() {
  const [suggestion, setSuggestion] = useState(null)
  const sketchElement = useRef()

  const [showSuggestion, setShowSuggestion] = useState(true)
  const setShowSuggestionLocalStorage = (shouldShow) => {
    setShowSuggestion(shouldShow)
    window.localStorage.setItem('showSuggestion', shouldShow)
  }

  const generateSuggestion = useCallback(() => {
    const noun = suggestions[Math.floor(Math.random() * suggestions.length)]
    setSuggestion(noun)
  }, [])

  useEffect(() => {
    const localStorageShowSuggestion = window.localStorage.getItem('showSuggestion')
    const shouldShow = localStorageShowSuggestion !== undefined ? localStorageShowSuggestion === 'true' : true
    setShowSuggestion(shouldShow)
    generateSuggestion()
  }, [setShowSuggestion, generateSuggestion])

  const [drawingKey, setDrawingKey] = useState('0')
  const getSquiggles = () => {
    setDrawingKey(drawingKey + 1)
  }

  return (
    <div className={styles.main}>
      <Container>
        <Controls showSuggestion={showSuggestion} setShowSuggestion={setShowSuggestionLocalStorage} getSquiggles={getSquiggles} />
      </Container>
      <Container className={styles.container}>
        <Drawing ref={sketchElement} generateSuggestion={generateSuggestion} key={drawingKey} />
        <div className={styles.buttonContainer}>
          <div className={styles.rotateButtonDiv}>
            {/*<Fab className={styles.rotateButton} size='small'>*/}
            {/*  <RotateRightIcon />*/}
            {/*</Fab>*/}
          </div>
          {
            showSuggestion && suggestion &&
            <Fab variant='extended' color='primary' onClick={generateSuggestion}>
              Draw <span className={styles.suggestionText}>{suggestion}</span>
            </Fab>
          }
          <div className={styles.emptySide} />
        </div>
      </Container>
    </div>
  )
}