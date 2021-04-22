import styles from './App.module.css'
import AppBar from '@material-ui/core/AppBar'
import Main from './components/Main'
import Logo from './components/Logo'
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
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <div className={styles.header}>
          <AppBar color='white' position='relative' className={styles.appBar}>
            <div className={styles.headerText}>
              <Logo />
              squiggler
            </div>
          </AppBar>
        </div>
        <div className={styles.main}>
          <Main />
        </div>
      </div>
    </ThemeProvider>
  )
}
