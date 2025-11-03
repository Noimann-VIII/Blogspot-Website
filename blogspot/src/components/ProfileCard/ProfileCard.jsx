import MemberCard from "../MemberCard/MemberCard";
import "./profile-card.css";

function ProfileCard(){
    return(
        <>
        <div className="profile-card">

            <h3>Welcome to Omni Psience, a space where curiosity meets creativity! We share insights, stories, 
                and discoveries about everything under the sun — from technology and science to lifestyle and culture. 
                Our goal is to spark ideas, inspire learning, and connect with curious minds everywhere.</h3>

            <div id="about">    
            <h3>About Our Blog Posting:</h3> 
            <h3>At Omni Psience, every post is crafted with passion and purpose. We aim to deliver meaningful content that 
                both informs and inspires our readers. Whether it’s a deep dive into scientific concepts, thought-provoking 
                discussions, or lighthearted reads about everyday life, our blog is dedicated to exploring knowledge from all 
                angles. We believe that learning never stops — and through every post, we invite you to grow, wonder, and discover with us.</h3>
            </div>
        </div>

        <h2>Members:</h2>    
        <div id="member">
            <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="Jan Roy Cruz"
             age = "20"
             />

            <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="John Marcel Cruz"
             age = "20"
             />

            <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="Kristelle Esquivel"
             age = "20"
             />
            
             <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="Arthur Elroj Delos Santos"
             age = "20"
             />

            <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="Kyla Naz"
             age = "20"
             />

             <MemberCard
             imageURL="https://m.media-amazon.com/images/M/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_FMjpg_UX1000_.jpg"
             name="Jerome Medina"
             age = "20"
             />
        </div>

        </>
    )
}

export default ProfileCard