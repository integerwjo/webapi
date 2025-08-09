import React, {useState} from "react";
import { use } from "react";
const Counter = () => {

    const [counter, setCount] = useState(0)
    
    const increase = () => {
        setCount(counter => counter + 1)
        setCount(counter => counter + 1)
    }

    const decrease = () => {
        setCount(c => c - 1)
    }

     const reset = () => {
        setCount(0)
    }
    
    return (
        <div>
            <h1>{counter}</h1>
            <button onClick={decrease}>Decrease</button>
            <button onClick={reset}>Reset</button>
            <button onClick={increase}>Increase</button>
        </div>
    );
}

export default Counter