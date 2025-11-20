import "./member-card.css"

function MemberCard(m){
    return(
        <>
        <div className="member-card">
            <div>
                <img src={m.imageURL} alt={m.name} />
            </div>
            <div>
                <h3>{m.name}</h3>
                <p>{m.age} years old</p>
            </div>
        </div>
        </>
    )
}

export default MemberCard