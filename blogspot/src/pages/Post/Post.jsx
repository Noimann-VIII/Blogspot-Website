import { useState, useEffect } from "react";
import UserProfile from "../../components/UserProfile/UserProfile";
import "./post.css";
import PostList from "../../components/PostList/PostList";
import { database, auth } from "../../firebase-config";
import { ref, push, remove, onValue } from "firebase/database";

function Post() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Hardcoded users (including current user)
  const [users, setUsers] = useState({
    u1: { firstName: "Kyla", lastName: "Naz" }, // current user
    u2: { firstName: "John", lastName: "Doe" },
    u3: { firstName: "Jane", lastName: "Smith" },
  });

  // Get currently logged-in user from Firebase
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const name = currentUser.displayName || currentUser.email || "User";
        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts[1] || "";
        
        const loggedInUser = {
          uid: currentUser.uid,
          firstName: firstName,
          lastName: lastName,
          email: currentUser.email,
        };
        
        setUser(loggedInUser);
        
        // Add current user to users map
        setUsers((prevUsers) => ({
          ...prevUsers,
          [currentUser.uid]: { firstName, lastName },
        }));
      } else {
        // No user logged in
        setUser(null);
      }
    });

    return unsubscribeAuth;
  }, []);

  // Fetch posts from Firebase on component mount
  useEffect(() => {
    const postsRef = ref(database, "posts");
    
    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postsData = snapshot.val();
        // Convert Firebase object to array of posts
        const postsArray = Object.keys(postsData).map((key) => ({
          postID: key,
          ...postsData[key],
        }));
        // Sort by newest first
        postsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup listener on unmount
  }, []);

  const createPost = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const newPost = {
      owner: user.uid,
      content: trimmed,
      timestamp: Date.now(),
      firstName: user.firstName,
      lastName: user.lastName,
    };

    try {
      // Push to Firebase
      await push(ref(database, "posts"), newPost);
      setContent(""); // clear textarea
    } catch (error) {
      alert("Error creating post: " + error.message);
    }
  };

  const deletePost = async (postID) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      // Delete from Firebase
      await remove(ref(database, `posts/${postID}`));
    } catch (error) {
      alert("Error deleting post: " + error.message);
    }
  };

  return (
    <>
      {user && <UserProfile />}
      {user && (
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
      )}
      {loading ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No posts yet. Be the first to create one!</p>
      ) : (
        <>
          <PostList posts={posts} users={users} currentUser={user} deletePost={deletePost} />
        </>
      )}
    </>
  );
}

export default Post;
