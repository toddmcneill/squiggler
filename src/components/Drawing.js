import { forwardRef, useState, useEffect, useCallback } from 'react'
import styles from './Drawing.module.css'

// Controls the effective resolution of the canvas.
const SCALAR = 2

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
      isCurve: Math.random() < .7
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

  const isSorted = Math.random() < .3
  const isVerticalSort = Math.random() < .5
  const smoothingFactor = Math.random() * 5 + 0.5
  randomPoints
    .sort((a, b) => {
      if (!isSorted) {
        return 0
      }
      if (isVerticalSort) {
        return b.y - a.y
      } else {
        return b.x - a.x
      }
    })
    .forEach((point, i) => {

      point.isCurve
        ? smoothLine(ctx, { a: indexOrNext(i - 1), b: indexOrNext(i), c: indexOrLast(i + 1), d: indexOrLast(i + 2)}, smoothingFactor)
        : drawLine(ctx, point, indexOrLast(i + 1))
  })
  // ctx.strokeStyle = penColor
  ctx.lineWidth = 5 * SCALAR
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawLine(ctx, start, end) {
  ctx.moveTo(start.x * SCALAR, start.y * SCALAR)
  ctx.lineTo(end.x * SCALAR, end.y * SCALAR)
  ctx.stroke()
}

export function getFirstControlPoint({ a, b, c}, smoothingFactor) {
  const x = b.x + (c.x - a.x) / smoothingFactor
  const y = b.y + (c.y - a.y) / smoothingFactor
  return { x, y }
}

export function getSecondControlPoint({ b, c, d}, smoothingFactor) {
  const x = c.x + (b.x - d.x) / smoothingFactor
  const y = c.y + (b.y - d.y) / smoothingFactor
  return { x, y }
}

// Values between 5 and 10 seem to work best. Too high, and it doesn't smooth much. Too low, and it makes swoopy artifacts.
const SMOOTHING_FACTOR = 6

function smoothLine(ctx, { a, b, c, d }, smoothingFactor = SMOOTHING_FACTOR) {
  // Draw a line between B and C. Use the slope of the surrounding points to calculate control points.
  ctx.moveTo(b.x * SCALAR, b.y * SCALAR)
  const firstControl = getFirstControlPoint({ a, b, c }, smoothingFactor)
  const secondControl = getSecondControlPoint({ b, c, d }, smoothingFactor)
  ctx.bezierCurveTo(firstControl.x * SCALAR, firstControl.y * SCALAR, secondControl.x * SCALAR, secondControl.y * SCALAR, c.x * SCALAR, c.y * SCALAR)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3 * SCALAR
  ctx.lineCap = 'smooth'
  ctx.stroke()
}

function getPoint(sketchElement, x, y) {
  const { top, left } = sketchElement.current.getBoundingClientRect()
  return { x: x - left - window.pageXOffset, y: y - top - window.pageYOffset }
}

const Drawing = forwardRef(({ generateSuggestion }, sketchElement) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [pointState, setPointState] = useState({})

  const startNewSquiggle = useCallback(() => {
    // Scale canvas to the same ratio as its pixel size.
    const canvas = sketchElement.current
    const { width, height } = canvas.getBoundingClientRect()
    canvas.setAttribute('width', width * SCALAR)
    canvas.setAttribute('height', height * SCALAR)

    // Clear canvas
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)

    // Draw squiggle
    drawRandomSquiggle(ctx, width, height)

    // Generate a new suggestion.
    generateSuggestion()
  }, [sketchElement, generateSuggestion])

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
  )
})

export default Drawing