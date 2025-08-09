

const UserGreeting = (props) =>{
     
        if(props.isLoggedIn){
            return <h2 className="welcome-message">Welcome {props.username}</h2>
        }
        else{
            return <h2 className="login-prompt" styles = {styles}>Login to continue</h2>
        }
}

export default UserGreeting