import { useRef, useState, useEffect, useCallback } from 'react'
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

// Values between 5 and 10 seem to work best. Too high, and it doesn't smooth much. Too low, and it makes swoopy artifacts.
const SMOOTHING_FACTOR = 6

export function getFirstControlPoint({ a, b, c}) {
  const x = b.x + (c.x - a.x) / SMOOTHING_FACTOR
  const y = b.y + (c.y - a.y) / SMOOTHING_FACTOR
  return { x, y }
}

export function getSecondControlPoint({ b, c, d}) {
  const x = c.x + (b.x - d.x) / SMOOTHING_FACTOR
  const y = c.y + (b.y - d.y) / SMOOTHING_FACTOR
  return { x, y }
}

function smoothLine(ctx, { a, b, c, d }) {
  // Draw a line between B and C. Use the slope of the surrounding points to calculate control points.
  ctx.beginPath()
  ctx.moveTo(b.x, b.y)
  const firstControl = getFirstControlPoint({ a, b, c })
  const secondControl = getSecondControlPoint({ b, c, d })
  ctx.bezierCurveTo(firstControl.x, firstControl.y, secondControl.x, secondControl.y, c.x, c.y)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.lineCap = 'smooth'
  ctx.stroke()
}

function getPoint (sketchElement, event) {
  const { top, left } = sketchElement.current.getBoundingClientRect()
  return { x: event.pageX - left - window.pageXOffset, y: event.pageY - top - window.pageYOffset }
}

export default function Main() {
  const [mouseDown, setMouseDown] = useState(false)
  const [pointState, setPointState] = useState({})
  const sketchElement = useRef()

  const fixCanvasScale = () => {
    const canvas = sketchElement.current
    const { width, height } = canvas.getBoundingClientRect()
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    return { width, height }
  }

  const startNewSquiggle = useCallback(() => {
    // Scale canvas to 1:1 with pixel size.
    const canvas = sketchElement.current
    const { width, height } = fixCanvasScale()

    // Clear canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)

    // Draw squiggle
    drawRandomSquiggle(ctx, width, height)
  }, [sketchElement])

  // Reset the canvas on window resize to avoid weird offset issues.
  // It's not the optimal solution, but prevents a pretty confusing bug.
  // useEffect(() => {
  //   const resizeHandler = () => {
  //     fixCanvasScale()
  //     startNewSquiggle()
  //   }
  //
  //   window.addEventListener('resize', resizeHandler)
  //   return () => {
  //     window.removeEventListener('resize', resizeHandler)
  //   }
  // })

  useEffect(() => {
    startNewSquiggle()
  }, [startNewSquiggle])

  const onMouseDown = (event) => {
    setMouseDown(true)
    const point = getPoint(sketchElement, event)
    setPointState({ b: point, c: point, d: point })
  }

  const onMouseUp = (event) => {
    onMouseMove(event)
    onMouseMove(event)
    setMouseDown(false)
  }

  const onMouseMove = (event) => {
    if (mouseDown) {
      const newPointState = { a: pointState.b, b: pointState.c, c: pointState.d, d: getPoint(sketchElement, event) }
      smoothLine(sketchElement.current.getContext('2d'), newPointState)
      setPointState(newPointState)
    }
  }

  return (
    <Container className={styles.container}>
      <div className={styles.drawingArea}>
        <canvas ref={sketchElement}
          className={styles.canvas}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          // onMouseLeave={drawMouseLeave}
          // onTouchStart={event => setPositionAndDraw(event, false)}
          // onTouchMove={setPositionAndDraw}
          // onTouchEnd={setPositionAndDraw}
          />
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
