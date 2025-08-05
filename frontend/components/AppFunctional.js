import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [st, setSt] = useState({
    message: initialMessage,
    index: initialIndex,
    steps: initialSteps,
    email: initialEmail,
  })

  function getXY(arg) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let string = "", x, y
    const gridArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ]
    for (let i = 0; i < gridArray.length; i++) {
      for (let j = 0; j < gridArray[i].length; j++) {
        if (gridArray[i][j] === st.index) {
          x = j+1
          y = i+1
          string =`(${j+1}, ${i+1})`
        } 
      }
    }
    if (arg === 'x') return x
    else if (arg === 'y') return y
    return string
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setSt({
      message: initialMessage,
      index: initialIndex,
      steps: initialSteps,
      email: initialEmail
    })
  }

  function move(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "left") {
      if ((st.index - 1) >= 0 && st.index !== 3 && st.index !== 6) {
        setSt({...st, index: st.index-1, steps: st.steps+1, message: ""})
      } else {
        setSt({...st, message: "You can't go left"})
      }
    }
    if (direction === "right") {
      if ((st.index + 1) <= 8 && st.index !== 2 && st.index !== 5) {
        setSt({...st, index: st.index+1, steps: st.steps+1, message: ""})
      } else {
        setSt({...st, message: "You can't go right"})
      }
    }
    if (direction === "up") {
      if ((st.index - 3) >= 0) {
        setSt({...st, index: st.index-3, steps: st.steps+1, message: ""})
      } else {
        setSt({...st, message: "You can't go up"})
      }
    }
    if (direction === "down") {
      if ((st.index + 3) <= 8) {
        setSt({...st, index: st.index+3, steps: st.steps+1, message: ""})
      } else {
        setSt({...st, message: "You can't go down"})
      }
    }
  }


  function onChange(evt) {
    // You will need this to update the value of the input.
    setSt({...st, email: evt.target.value})
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const post = {
      x: getXY('x'),
      y: getXY('y'),
      steps: st.steps,
      email: st.email
    }
    console.log(post)
    axios.post('http://localhost:9000/api/result', post) 
      .then(res => {
        setSt({...st, message: res.data.message, email: ''})
      })
      .catch(() => {
        if (post.email === '') setSt({...st, message: "Ouch: email is required"})
        else if (post.email === 'foo@bar.baz') setSt({...st, message: 'foo@bar.baz failure #71'})
        else setSt({...st, message: 'Ouch: email must be a valid email'}) 
      })  
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXY()}</h3>
        <h3 id="steps">You moved {st.steps} time{st.steps === 1 ? '' : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div 
              key={idx} 
              className={`square${idx === st.index ? ' active' : ''}`}
            >
              {idx === st.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{st.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => move("left")} id="left">LEFT</button>
        <button onClick={() => move("up")} id="up">UP</button>
        <button onClick={() => move("right")} id="right">RIGHT</button>
        <button onClick={() => move("down")} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={st.email} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
