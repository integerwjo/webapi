//useRef => does not cause rerenders when the value changes
import React, {useState, useRef, useEffect} from 'react'

const Hello = () => {
    const ref = useRef(0);

    const handleCount = () =>  {
        ref.current++
        console.log(ref)

        
    }

      useEffect(() => {
        console.log("component renderd!!")
      })
      return(<><div>
             <button onClick={handleCount}>Count</button>
        </div></>);
}

export default Hello