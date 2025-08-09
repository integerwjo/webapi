import profile from './assets/react.svg'

const Card = () => {

    const styles = {
        
    }
    return (
        <div className="card">
              <img className='card-image' src={profile} alt="profile-picture" />
              <h2 className='card-title'>Integer</h2>
              <p className='card-text'>Backend web developer and network engineer</p>

        </div>
    );
}


export default Card