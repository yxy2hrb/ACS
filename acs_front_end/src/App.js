import logo from './logo.svg';
import './App.css';
import Nav from "./Nav/nav";
import Topbar from './topbar/topbar';
import Course from "./course/course";
import Classroom from "./classroom/classroom";
import RoomList from './list/list';
import { BrowserRouter as Router, Route,Routes, Outlet } from "react-router-dom";
import Schedule from './shedule/schedule';
const NotFound = () => <h1>404</h1>
function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/teacher/" element={<div><Topbar/><Nav/></div>} />
      <Route exact path="/teacher/course" element={<div><Topbar/><Nav/><Course></Course></div>} />
      <Route exact path="/teacher/classroom" element={<div><Topbar/><Nav/><Classroom></Classroom></div>} />
      <Route exact path="/teacher/classroom/list" element={<div><Topbar/><Nav/><RoomList></RoomList></div>} />
      <Route exact path="/teacher/schedule" element={<div><Topbar/><Nav/><Schedule></Schedule></div>} />
           

        

      
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </Router>
  );
}

export default App;
