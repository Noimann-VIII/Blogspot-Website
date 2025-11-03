import "./not-found.css";
import bgImage from "C:/Users/user/Documents/AWA Final Project/Blogspot-Website/blogspot/src/assets/404bg.webp";

function NotFound() {
  return (
    <>

      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
        }}
      >
      </div>
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
    </>
  );
}

export default NotFound;