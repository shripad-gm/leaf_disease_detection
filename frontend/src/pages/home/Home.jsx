import LogoutButton from "../../components/LogOutButton";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
  return (
    <>
      <div className="UpperDiv">
        <Navbar />
        <div className="textBox">
          <div className="actualText">
            <p className="instantText">Instant plant health insights</p>
          </div>
        </div>
        <div className="HoveringBoxes">
          <div className="ReportGen ">
            <div className="start">
              <span>
                <i className="fa-solid fa-file-export"></i>
              </span>
            </div>
            <div className="mid">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur, autem, necessitatibus obcaecati ab at, voluptatibus
                vero fugit excepturi eligendi Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Laudantium animi nisi quasi id
                sequi magni, neque eius! Quisquam laborum sunt,{" "}
              </p>
            </div>
            <div className="end">
              <Link to="/report">
                <div className="GenerateBtn">Generate</div>
              </Link>
            </div>
          </div>
          <div className="WeatherDetect">
            <div className="start">
              <span>
                <i class="fa-solid fa-cloud"></i>
              </span>
            </div>
            <div className="mid">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur, autem, necessitatibus obcaecati ab at, voluptatibus
                vero fugit excepturi eligendi Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Laudantium animi nisi quasi id
                sequi magni, neque eius! Quisquam laborum sunt,{" "}
              </p>
            </div>
            <div className="end">
              <div className="GenerateBtn">Generate</div>
            </div>
          </div>
        </div>
      </div>

	  
    </>
  );
};
export default Home;
