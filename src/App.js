import { useState } from 'react'
import styles from './App.module.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Main from './components/Main'
import Logo from './components/Logo'
import IconButton from '@material-ui/core/IconButton'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Instructions from './components/Instructions'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4DD0E1',
      dark: '#00ACC1'
    },
    secondary: {
      main: '#FFEB3B',
      dark: '#FDD835'
    }
  },
})

export default function App() {
  const [instructionsOpen, setInstructionsOpen] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <div className={styles.header}>
          <AppBar color='transparent' position='relative'>
            <Toolbar>
              <div className={styles.headerText}>
                <Logo />
                squiggler
              </div>
              <IconButton onClick={() => setInstructionsOpen(true)}>
                <HelpOutlineIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <div className={styles.main}>
          <Main />
        </div>
      </div>
    <Instructions isOpen={instructionsOpen} setIsOpen={setInstructionsOpen} />
    </ThemeProvider>
  )
}
