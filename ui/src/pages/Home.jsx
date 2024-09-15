import React from 'react';
import './Home.css';
import brochureImage from '/Snap_NC.png';
import { MDBTypography } from 'mdb-react-ui-kit';

function Home() {
  return (
    <div className="home">
      <div className="content-wrapper">
        {/* Brochure Container */}
        <div className="brochure-container fade-in-left">
          <img src={brochureImage} alt="Brochure" className="brochure-image" />
        </div>

        {/* Text Container */}
        <div className="text-container fade-in-right">
          <div className="logo-title-container">
            <MDBTypography tag="h1" variant="h2" className="app-title">
              Use Your Data Easier!
            </MDBTypography>
          </div>
          <p>
          Introducing SnapNC, a groundbreaking platform that democratizes access to satellite data for everyone. We've developed an intuitive application that allows users to effortlessly select any area on the map, choose from a range of analytical parameters, and generate comprehensive reports—all with just a few clicks. Whether you're a researcher seeking detailed environmental data or an individual with a keen interest in satellite imagery, SnapNC empowers you to harness advanced geospatial analysis without the need for specialized technical skills.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;