import { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import onboarding1 from '../images/instructions1.svg'
import onboarding2 from '../images/instructions2.svg'

const StyledDialogContent = withStyles({
  root: {
    padding: 0,
  },
})(DialogContent)

const StyledDialogTitle = withStyles(() => ({
  root: {
    padding: 0
  }
}))(DialogTitle)

export default function Instructions({ isOpen, setIsOpen }) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    const shown =  localStorage.getItem('instructionsShown')
    if (!shown) {
      setIsOpen(true)
    }
    console.log('in here')
  })

  let img = onboarding1
  let title = 'Welcome to Squiggler!'
  let copy = 'Kickstart your creativity with simple design exercises that will open your mind and test your imagination'
  if (page === 2) {
    img = onboarding2
    title = 'How it Works.'
    copy = "It's simple! Generate a line and then use your creative power to finish the picture. Draw whatever comes to mind. There are no rules."
  }

  return (
    <Dialog open={isOpen} onBackdropClick={() => setIsOpen(false)}>
      <StyledDialogContent>
        <img style={{marginTop: '-20px'}} src={img} width='100%' alt='instructions' />
      </StyledDialogContent>
      <DialogActions disableSpacing={true}>
        <div>
          <StyledDialogTitle>{title}</StyledDialogTitle>
          <Typography gutterBottom={true} style={{fontSize: '.9rem'}}>{copy}</Typography>
        </div>
        <div>
          <Button variant='contained' color='secondary' onClick={() => {
            if (page === 1) {
              setPage(2)
            } else {
              localStorage.setItem('instructionsShown', true)
              setIsOpen(false)
              setTimeout(() => {
                setPage(1)
              }, 500)
            }
          }}>Continue</Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}