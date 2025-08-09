import React, {useState} from "react";
//onchange => primarily used for form elements 
function MyComponentt() {
   const [name, setName] = useState("")
   const [quantity, setQuantity] = useState()
   const [payment, setPayment] = useState()
   
   function handleNameChange(e){
       setName(e.target.value)
   }

   function handleChangeQuantity(e){
    setQuantity(e.target.value)
   }

   return (<div>
        <input value={name} onChange={handleNameChange} />
        <p>Name : {name}</p>
   </div>);
}
 export default MyComponentt