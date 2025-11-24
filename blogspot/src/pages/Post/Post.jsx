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
  const [users, setUsers] = useState({});
  const AUTHORIZED_UID = "xUg0AlYWTOamb4VEzWDoIcXS17L2";


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

        setUsers((prevUsers) => ({
          ...prevUsers,
          [currentUser.uid]: { firstName, lastName },
        }));
      } else {
        setUser(null);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const name = currentUser.displayName || currentUser.email || "User";
        const nameParts = name.split(" ");
        const fallbackFirstName = nameParts[0];
        const fallbackLastName = nameParts[1] || "";

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          firstName: fallbackFirstName,
          lastName: fallbackLastName,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      const userRef = ref(database, `users/${user.uid}`);

      const unsubscribeDB = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const dbUserData = snapshot.val();

          const { firstName, lastName } = dbUserData;

          if (firstName && lastName) {

            setUser((prevUser) => ({
              ...prevUser,
              firstName,
              lastName,
            }));
          }
        }
      });

      return () => unsubscribeDB();
    }
  }, [user?.uid]);

  useEffect(() => {
    const postsRef = ref(database, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postsData = snapshot.val();
        const postsArray = Object.keys(postsData).map((key) => ({
          postID: key,
          ...postsData[key],
        }));
        postsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createPost = async () => {
    if (!user || user.uid !== AUTHORIZED_UID)
    {
      return;
    }

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
      await push(ref(database, "posts"), newPost);
      setContent("");
    } catch (error) {
      alert("Error creating post: " + error.message);
    }
  };

  const deletePost = async (postID) => {
    try {
      await remove(ref(database, `posts/${postID}`));
    } catch (error) {;
    }
  };

  const isAuthorizedPoster = user && user.uid === AUTHORIZED_UID;

  return (
    <>
      {user && <UserProfile />}
      {isAuthorizedPoster && (
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
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No posts yet. Be the first to create one!
        </p>
      ) : (
        <>
          <PostList
            posts={posts}
            users={users}
            currentUser={user}
            deletePost={deletePost}
          />
        </>
      )}
    </>
  );
}

export default Post;