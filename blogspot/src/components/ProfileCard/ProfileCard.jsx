import MemberCard from "../MemberCard/MemberCard";
import "./profile-card.css";
import omniLogo from "../../assets/Omni Psience Logo Centered.png";

function ProfileCard(){
    return(
        <>
        <div className="profile-card">

            <p>Welcome to Omni Psience, a space where curiosity meets creativity! We share insights, stories, 
                and discoveries about everything under the sun — from technology and science to lifestyle and culture. 
                Our goal is to spark ideas, inspire learning, and connect with curious minds everywhere.</p>

            <div id="about">    
            <p>About Our Blog Posting:</p> 
            <p>At Omni Psience, every post is crafted with passion and purpose. We aim to deliver meaningful content that 
                both informs and inspires our readers. Whether it’s a deep dive into scientific concepts, thought-provoking 
                discussions, or lighthearted reads about everyday life, our blog is dedicated to exploring knowledge from all 
                angles. We believe that learning never stops — and through every post, we invite you to grow, wonder, and discover with us.</p>
            </div>
        </div>

        <h1>Members:</h1>    
        <div id="member">
            <MemberCard
             imageURL={omniLogo}
             name="Arthur Elroj Delos Santos"
             age = "20"
             />

            <MemberCard
             imageURL={omniLogo}
             name="Jan Roy Cruz"
             age = "20"
             />

            <MemberCard
             imageURL={omniLogo}
             name="Jerome Medina"
             age = "20"
             />

            <MemberCard
             imageURL={omniLogo}
             name="John Marcel Cruz"
             age = "20"
             />

            <MemberCard
             imageURL={omniLogo}
             name="Kristelle Esquivel"
             age = "20"
             />

            <MemberCard
             imageURL={omniLogo}
             name="Kyla Naz"
             age = "20"
             />
        </div>

        </>
    )
}

export default ProfileCard