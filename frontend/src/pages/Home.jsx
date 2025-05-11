import React from 'react';
import Signsvg from '../assets/Signsvg';
import HomeNavbar from '../components/HomeNavbar';
function Home() {
  return (
    <div style={{ textAlign: 'center'}}>
      {/* <h1>Welcome to the Home Page</h1> */}
      <HomeNavbar />
      

      <Signsvg />
      


    </div>
  );
}

export default Home;