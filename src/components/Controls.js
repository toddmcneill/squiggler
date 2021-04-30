import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import styles from './Controls.module.css'

export default function Controls({ showSuggestion, setShowSuggestion, startNewSquiggle }) {
  const handleSuggestionToggle = (event) => {
    setShowSuggestion(event.target.checked)
  }

  return (
    <div className={styles.controls}>
      <div className={styles.suggestionControls}>
        <FormControlLabel
          control={
            <Switch
              checked={showSuggestion}
              color='primary'
              onChange={handleSuggestionToggle}
            />
          }
          label='Include Drawing Prompt'
        />
      </div>
      <Button variant='contained' color='secondary' onClick={startNewSquiggle}>
        Get Squiggles
      </Button>
    </div>
  )
}