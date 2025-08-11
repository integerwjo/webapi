import { useState, useEffect } from "react"; 
import { BrowserRouter , useParams} from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import AnnouncementsPage from "./Announcements.jsx";
import CustomizedTables from "./Table.jsx";
import MatchFixtures from "./Fixtures.jsx";
import Clubs from './Clubs.jsx'
import MatchResults from "./Results.jsx"; // Assuming you want to use MatchResults in the app
import ScoreboardTable from "./Table.jsx";
import ClubDetailsCard from "./ClubDetail.jsx";
import ManCityLogo from './assets/man city.jpg'; // Example logo import
import PlayerDetailsCard from "./PlayerDetails.jsx"; // Importing PlayerDetailsCard
import kdb from './assets/kdb.jpeg'; // Example player photo import
import SignIn from "./SignIn.jsx";
import SignUpForm from "./SignUp.jsx";
import News from "./News.jsx"; // Importing News component
import ChatScreen from "./Chats.jsx"; // Importing Chat component
import ChatRoom from "./ChatRoom.jsx"; // Importing ChatRoom component


function App() {
  const [clubs, setClubs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [matchFixtures, setMatchFixtures] = useState([]);
  const [clubStats, setClubStats] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/standings/')
      .then(res => res.json())
      .then(data => setClubStats(data))
      .catch(err => console.error('Error fetching club stats:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/clubs/')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error('Error fetching clubs:', err));
  }, []);

   useEffect(() => {
    fetch('http://localhost:8000/api/news/')
      .then(res => res.json())
      .then(data => setNewsArticles(data))
      .catch(err => console.error('Error fetching news articles:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/fixtures/')
      .then(res => res.json())
      .then(data => setMatchFixtures(data))
      .catch(err => console.error('Error fetching match fixtures:', err));
  }, []);


  useEffect(() => {
    fetch('http://localhost:8000/api/results/')
      .then(res => res.json())
      .then(data => setMatchResults(data))
      .catch(err => console.error('Error fetching match results:', err));
  }, []);


const ChatRoomWrapper = () => {
  const { roomName } = useParams();
  return <ChatRoom roomName={roomName} />;
};

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News articles={newsArticles} />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/players/:id" element={<PlayerDetailsCard  />} />
          <Route path="/clubs/:id" element={<ClubDetailsCard  ClubDetails />} />
          <Route path="/fixtures" element={<MatchFixtures fixtures={matchFixtures} />} />
          <Route path="/league-table" element={<ScoreboardTable teams={clubStats} />} />
          <Route path="/results" element={<MatchResults results={matchResults} />} />
          <Route path="/clubs" element={<Clubs data={clubs} />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

