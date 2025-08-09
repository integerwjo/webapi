import { useLayoutEffect } from "react";

const List = () =>{
    const fruits = ["apple", "orange", "banana"]

    const listItems = fruits.map(fruit => <li>{fruit}</li>)
    return (<ul>{listItems}</ul>);
}

export default List