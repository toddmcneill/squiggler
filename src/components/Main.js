import { useRef, useState, useEffect, useCallback } from 'react'
import Fab from '@material-ui/core/Fab'
import Container from '@material-ui/core/Container'
import AddIcon from '@material-ui/icons/Add'
import styles from './Main.module.css'

function random(limit) {
  return Math.floor(Math.random() * limit)
}

function semiRandom(limit) {
  return Math.floor(Math.random() * limit * .8) + limit * .1
}

function drawRandomSquiggle(ctx, width, height) {
  const randomPoints = []
  for (let i = 0; i < random(3) + 4; i++) {
    randomPoints.push({
      x: semiRandom(width),
      y: semiRandom(height),
      isCurve: Math.random() > .5
    })
  }

  function indexOrNext (index) {
    if (randomPoints[index]) {
      return randomPoints[index]
    } else if (randomPoints[index + 1]) {
      return randomPoints[index + 1]
    } else {
      return randomPoints[index + 2]
    }
  }
  
  function indexOrLast (index) {
    if (randomPoints[index]) {
      return randomPoints[index]
    } else if (randomPoints[index - 1]) {
      return randomPoints[index - 1]
    } else {
      return randomPoints[index - 2]
    }
  }

  randomPoints.sort((a, b) => {
    if (Math.random > .5) {
      return b.y - a.y
    } else {
      return b.x - a.x
    }
  }).forEach((point, i) => {
    point.isCurve
      ? smoothLine(ctx, { a: indexOrNext(i - 1), b: indexOrNext(i), c: indexOrLast(i + 1), d: indexOrLast(i + 2)})
      : drawLine(ctx, point, indexOrLast(i + 1))
  })
  // ctx.strokeStyle = penColor
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawLine(ctx, start, end) {
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()
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
  ctx.moveTo(b.x, b.y)
  const firstControl = getFirstControlPoint({ a, b, c })
  const secondControl = getSecondControlPoint({ b, c, d })
  ctx.bezierCurveTo(firstControl.x, firstControl.y, secondControl.x, secondControl.y, c.x, c.y)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.lineCap = 'smooth'
  ctx.stroke()
}

function getPoint(sketchElement, x, y) {
  const { top, left } = sketchElement.current.getBoundingClientRect()
  return { x: x - left - window.pageXOffset, y: y - top - window.pageYOffset }
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
  // It's disabled for now because it also causes confusing behavior.
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
    const point = getPoint(sketchElement, event.pageX, event.pageY)
    setPointState({ b: point, c: point, d: point })
    sketchElement.current.getContext('2d').beginPath()
  }

  const onMouseMove = (event) => {
    if (mouseDown) {
      const newPointState = { a: pointState.b, b: pointState.c, c: pointState.d, d: getPoint(sketchElement, event.pageX, event.pageY) }
      smoothLine(sketchElement.current.getContext('2d'), newPointState)
      setPointState(newPointState)
    }
  }

  const onMouseUp = (event) => {
    onMouseMove(event)
    onMouseMove(event)
    setMouseDown(false)
  }

  const onTouchStart = (event) => {
    setMouseDown(true)
    const x = event?.changedTouches?.[0]?.pageX
    const y = event?.changedTouches?.[0]?.pageY
    const point = getPoint(sketchElement, x, y)
    setPointState({ b: point, c: point, d: point })
  }

  const onTouchMove = (event) => {
    if (event.touches.length > 1) {
      return
    }
    if (mouseDown) {
      const x = event?.changedTouches?.[0]?.pageX
      const y = event?.changedTouches?.[0]?.pageY
      const newPointState = { a: pointState.b, b: pointState.c, c: pointState.d, d: getPoint(sketchElement, x, y) }
      smoothLine(sketchElement.current.getContext('2d'), newPointState)
      setPointState(newPointState)
    }
  }

  const onTouchEnd = (event) => {
    onTouchMove(event)
    onTouchMove(event)
    setMouseDown(false)
  }

  return (
    <Container className={styles.container}>
      <div className={styles.drawingArea}>
        <canvas ref={sketchElement}
          className={styles.canvas}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
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
