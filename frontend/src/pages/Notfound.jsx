import React from "react";
import "../assets/style/notfound.css";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <>
    <div className="notfound">
    <div className="text">
        <p>404</p>
      </div>
      <div className="container">
        <div className="caveman">
          <div className="leg">
            <div className="foot">
              <div className="fingers"></div>
            </div>
          </div>
          <div className="leg">
            <div className="foot">
              <div className="fingers"></div>
            </div>
          </div>
          <div className="shape">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <div className="head">
            <div className="eye">
              <div className="nose"></div>
            </div>
            <div className="mouth"></div>
          </div>
          <div className="arm-right">
            <div className="club"></div>
          </div>
        </div>
        <div className="caveman">
          <div className="leg">
            <div className="foot">
              <div className="fingers"></div>
            </div>
          </div>
          <div className="leg">
            <div className="foot">
              <div className="fingers"></div>
            </div>
          </div>
          <div className="shape">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <div className="head">
            <div className="eye">
              <div className="nose"></div>
            </div>
            <div className="mouth"></div>
          </div>
          <div className="arm-right">
            <div className="club"></div>
          </div>
        </div>
      </div>
      <a href="https://codepen.io/SofiaSergio/" target="_blank" rel="noopener noreferrer">
        <div id="link" className="text-black">
          <Link to ='/' className="text-xl border-2 p-2 rounded-2xl">Go to Home</Link>
        </div>
      </a>


    </div>
    
    
    </>
  );
};

export default Notfound;
