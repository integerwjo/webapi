import React, {useState} from "react";
const ColorPicker = () => {
     const [color, setColor] = useState("#ffffff")

     const handleColorChange = (e) => {
             setColor(e.target.value)
     }


     return (<div className="color-picker-container">
                  <h1>color picker</h1>

          <div className="color-display" style={{backgroundColor:color}}>
                   <p>selected color : {color}</p>
          </div>
          <label htmlFor="">Select a color : </label>
          <input type="color" value={color}  onChange={handleColorChange}/>
     </div>)
}   

export default ColorPicker