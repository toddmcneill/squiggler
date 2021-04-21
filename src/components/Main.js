import { useRef } from 'react'
import Fab from '@material-ui/core/Fab'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add'
import styles from './Main.module.css'

function random(limit) {
  return Math.floor(Math.random() * limit)
}
function halfRandom(limit) {
  return Math.floor(Math.random() * limit / 2) + limit / 4
}

function drawRandomSquiggle(ctx, width, height) {
  ctx.beginPath()
  let lineParams
  for (let i = 0; i < random(5) + 2; i++) {
    if (Math.random() > .5) {
      lineParams = drawRandomCurve(ctx, width, height, lineParams)
    } else {
      lineParams = drawRandomLine(ctx, width, height, lineParams)
    }
  }
  // ctx.strokeStyle = penColor
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawRandomLine(ctx, width, height, { startX = null, startY = null } = {}) {
  if (!startX) {
    startX = halfRandom(width)
  }
  if (!startY) {
    startY = halfRandom(height)
  }
  ctx.moveTo(startX, startY)
  const endX = halfRandom(width)
  const endY = halfRandom(height)
  ctx.lineTo(endX, endY)
  return { startX: endX, startY: endY }
}

function drawRandomCurve(ctx, width, height, { startX = null, startY = null, startBezierX, startBezierY } = {}) {
  if (!startX) {
    startX = halfRandom(width)
  }
  if (!startY) {
    startY = halfRandom(height)
  }
  ctx.moveTo(startX, startY)
  const endX = halfRandom(width)
  const endY = halfRandom(height)
  if (!startBezierX) {
    startBezierX = startX < endX ? startX + random(width / 2) : startX - random(width / 2)
  }
  if (!startBezierY) {
    startBezierY = startY < endY ? startY + random(width / 2) : startY - random(width / 2)
  }
  const endBezierX = startX < endX ? endX - random(width / 2) : endX + random(width / 2)
  const endBezierY = startY < endY ? endY - random(width / 2) : endY + random(width / 2)
  ctx.bezierCurveTo(startBezierX, startBezierY, endBezierX, endBezierY, endX, endY)
  return { startX: endX, startY: endY, startBezierX: 2 * endX - endBezierX, startBezierY: 2 * endY - endBezierY }
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
