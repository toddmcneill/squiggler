import { forwardRef, useState, useEffect, useCallback, useReducer } from 'react'
import styles from './Drawing.module.css'

// Controls the effective resolution of the canvas.
const SCALAR = 2

function random(limit) {
  return Math.floor(Math.random() * limit)
}

function randomWithPadding(limit) {
  // Choose a number within 60% of the limit, with a 20% padding on either side.
  return Math.floor(Math.random() * limit * .6) + limit * .2
}

function generateRandomSquiggle(width, height) {
  const randomPoints = []
  for (let i = 0; i < random(3) + 4; i++) {
    randomPoints.push({
      x: randomWithPadding(width),
      y: randomWithPadding(height),
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
  const sortedRandomPoints = randomPoints
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

  return sortedRandomPoints.map((point, i) => {
    if (point.isCurve) {
      const curveInfo = smoothCurve({ a: indexOrNext(i - 1), b: indexOrNext(i), c: indexOrLast(i + 1), d: indexOrLast(i + 2)}, smoothingFactor)
      return { type: 'curve', ...curveInfo, rotation: 0 }
    }
    const lineInfo = straightLine(point, indexOrLast(i + 1))
    return { type: 'line', ...lineInfo, rotation: 0 }
  })
}

function straightLine(start, end) {
  return {
    start: { x: start.x * SCALAR, y: start.y * SCALAR },
    end: { x: end.x * SCALAR, y: end.y * SCALAR },
  }
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

function smoothCurve({ a, b, c, d }, smoothingFactor = SMOOTHING_FACTOR) {
  // Draw a line between B and C. Use the slope of the surrounding points to calculate control points.

  const firstControl = getFirstControlPoint({ a, b, c }, smoothingFactor)
  const secondControl = getSecondControlPoint({ b, c, d }, smoothingFactor)

  return {
    start: { x: b.x * SCALAR, y: b.y * SCALAR },
    firstControl: { x: firstControl.x * SCALAR, y: firstControl.y * SCALAR},
    secondControl: { x: secondControl.x * SCALAR, y: secondControl.y * SCALAR },
    end: { x: c.x * SCALAR, y: c.y * SCALAR },
  }
}

function getPoint(sketchElement, x, y) {
  const { top, left } = sketchElement.current.getBoundingClientRect()
  return { x: x - left - window.pageXOffset, y: y - top - window.pageYOffset }
}


function rotateCanvas(ctx, rotation) {
  const centerX = ctx.canvas.width / 2
  const centerY = ctx.canvas.height / 2
  const rotationRadians = rotation * Math.PI / 180
  ctx.translate(centerX, centerY)
  ctx.rotate(rotationRadians)
  ctx.translate(-1 * centerX, -1 * centerY)
}

function drawStrokes(ctx, strokes, canvasRotation) {
  ctx.beginPath()
  let currentRotation = canvasRotation
  strokes.forEach(stroke => {
    // Rotate if necessary.
    const rotationAdjustment = currentRotation - stroke.rotation
    if (rotationAdjustment) {
      rotateCanvas(ctx, rotationAdjustment)
      currentRotation = stroke.rotation
    }

    // Draw the stroke
    switch (stroke.type) {
      case 'curve': {
        const { start, firstControl, secondControl, end } = stroke
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(firstControl.x, firstControl.y, secondControl.x, secondControl.y, end.x, end.y)
        ctx.stroke()
        break
      }
      case 'line': {
        const { start, end } = stroke
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        break
      }
      default:
    }
  })

  // Reset rotation if necessary
  const rotationAdjustmentReset = currentRotation - canvasRotation
  if (rotationAdjustmentReset) {
    rotateCanvas(ctx, rotationAdjustmentReset)
  }
}

const Drawing = forwardRef(({ generateSuggestion, rotation }, sketchElement) => {
  const [mouseDown, setMouseDown] = useState(false)
  const [pointState, setPointState] = useState({})

  const [strokes, addStroke] = useReducer((state, action) => {
    return [...state, action]
  }, [])
  const [drawnIndex, setDrawnIndex] = useState(0)

  // Handle new strokes and redraws.
  useEffect(() => {
    // Short circuit if there are no strokes to draw.
    if (drawnIndex === strokes.length) {
      return
    }

    // Get the canvas context.
    const ctx = sketchElement.current.getContext('2d')

    // Calculate the undrawn strokes.
    const undrawnStrokes = strokes.slice(drawnIndex)

    // Draw the strokes.
    drawStrokes(ctx, undrawnStrokes, rotation)

    // Update the drawn index.
    setDrawnIndex(strokes.length)
  }, [strokes, sketchElement, drawnIndex, rotation])

  // Handle rotations.
  useEffect(() => {
    const ctx = sketchElement.current.getContext('2d')

    // Clear canvas.
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Redraw the image.
    setDrawnIndex(0)
  }, [rotation, sketchElement])

  const startNewSquiggle = useCallback(() => {
    // Scale canvas to the same ratio as its pixel size.
    const canvas = sketchElement.current
    const { width, height } = canvas.getBoundingClientRect()
    canvas.setAttribute('width', width * SCALAR)
    canvas.setAttribute('height', height * SCALAR)

    // Clear canvas.
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width * SCALAR, height * SCALAR)

    // Set stroke style.
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3 * SCALAR
    ctx.lineCap = 'smooth'

    // Draw squiggle.
    const squiggleInfo = generateRandomSquiggle(width, height)
    squiggleInfo.forEach(squiggle => {
      addStroke(squiggle)
    })

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
  }

  const onMouseMove = (event) => {
    if (mouseDown) {
      const newPointState = { a: pointState.b, b: pointState.c, c: pointState.d, d: getPoint(sketchElement, event.pageX, event.pageY) }
      const curveInfo = smoothCurve(newPointState)
      addStroke({ type: 'curve', ...curveInfo, rotation })
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
      const curveInfo = smoothCurve(newPointState)
      addStroke({ type: 'curve', ...curveInfo, rotation })
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