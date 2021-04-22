import { useRef } from 'react'
import Fab from '@material-ui/core/Fab'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add'
import styles from './Main.module.css'

function random(limit) {
  return Math.floor(Math.random() * limit)
}

function drawRandomSquiggle(ctx, width, height) {
  ctx.beginPath()
  let x, y
  for (let i = 0; i < random(2) + 1; i++) {
    [x, y] = drawRandomLine(ctx, width, height, x, y)
  }
  for (let i = 0; i < random(2) + 1; i++) {
    [x, y] = drawRandomCurve(ctx, width, height, x, y)
  }
  // ctx.strokeStyle = penColor
  ctx.lineWidth = 5
  // ctx.lineCap = penType
  ctx.stroke()
}

function drawRandomLine(ctx, width, height, startX = null, startY = null) {
  if (!startX) {
    startX = random(width)
  }
  if (!startY) {
    startY = random(height)
  }
  ctx.moveTo(startX, startY)
  const endX = random(width)
  const endY = random(height)
  ctx.lineTo(endX, endY)
  return [endX, endY]
}

function drawRandomCurve(ctx, width, height, startX = null, startY = null) {
  if (!startX) {
    startX = random(width)
  }
  if (!startY) {
    startY = random(height)
  }
  ctx.moveTo(startX, startY)
  const endX = random(width)
  const endY = random(height)
  ctx.bezierCurveTo(random(width), random(height), random(width), random(height), endX, endY)
  return [endX, endY]
}

export default function Main() {
  const sketchElement = useRef()

  const startNewSquiggle = () => {
    // Scale canvas to 1:1 with pixel size.
    const canvas = sketchElement.current
    const { width, height } = canvas.getBoundingClientRect()
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    const ctx = canvas.getContext('2d')

    // clear canvas
    ctx.clearRect(0, 0, width, height)

    // draw squiggle
    drawRandomSquiggle(ctx, width, height)
  }

  return (
    <Container className={styles.container}>
      <div className={styles.drawingArea}>
        <canvas ref={sketchElement} className={styles.canvas} />
      </div>
      <div className={styles.buttonContainer}>
        <Fab variant='extended' color='secondary' onClick={startNewSquiggle}>
          <AddIcon />
          New Squiggle
        </Fab>
      </div>
    </Container>
  )
}
