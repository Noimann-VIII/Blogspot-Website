import { useState } from "react";
import UserProfile from "../../components/UserProfile/UserProfile";
import "./post.css";
import PostList from "../../components/PostList/PostList";

function Post() {
  const [content, setContent] = useState("");

  // Hardcoded users (including current user)
  const [users] = useState({
    u1: { firstName: "Kyla", lastName: "Naz" }, // current user
    u2: { firstName: "John", lastName: "Doe" },
    u3: { firstName: "Jane", lastName: "Smith" },
  });

  // Logged-in user
  const [user] = useState({ uid: "u1", firstName: "Kyla", lastName: "Naz" });

  // Hardcoded posts including posts from other users
  const [posts, setPosts] = useState([
    { postID: "p2", owner: "u2", content: "Hi everyone, nice to meet you!" },
    { postID: "p3", owner: "u3", content: "React is awesome!" },
  ]);

  const createPost = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const newPost = {
      postID: `p${Date.now()}`, // unique ID
      owner: user.uid,
      content: trimmed,
    };

    setPosts([newPost, ...posts]); // add new post at the top
    setContent(""); // clear textarea
  };

  const deletePost = (postID) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.postID !== postID));
  };

  return (
    <>
      <UserProfile />
      <div className="home-container">
        <div className="create-post">
          <div className="left">
            <img
              src={`https://avatar.iran.liara.run/username?username=${user.firstName}+${user.lastName}&background=000000&color=FFFFFF`}
              alt="Profile"
            />
          </div>
          <div className="right">
            <textarea
              id="txtContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            />
            <button onClick={createPost} disabled={!content.trim()}>
              Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Pass posts, users, and delete function */}
      <PostList posts={posts} users={users} currentUser={user} deletePost={deletePost} />
    </>
  );
}

export default Post;
