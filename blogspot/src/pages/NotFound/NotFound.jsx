import "./not-found.css";
import bgImage from "C:/Users/user/Documents/AWA Final Project/Blogspot-Website/blogspot/src/assets/404bg.webp"

function NotFound() {
  return (
    <>
      <div
        className="notfound-background"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="notfound-container">
          <h1>404</h1>
          <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
    </>
  );
}

export default NotFound;