import React, { useState, useEffect } from "react";
import "./post-list.css";
import { database } from "../../firebase-config";
import { ref, update, get } from "firebase/database";

function PostList({ posts, users, currentUser, deletePost }) {
  // State for post interactions
  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  
  // NEW STATE: Cache for user data fetched asynchronously from the database
  const [fetchedUsers, setFetchedUsers] = useState({});
  
  const currentUid = currentUser?.uid || null;

  // -------------------------------------------------------------------
  // 1. Initial Data Loading & Owner Name Check
  // -------------------------------------------------------------------
  
  // Load comments, likes, and ensure owner names are available for all posts
  useEffect(() => {
    posts.forEach((post) => {
      loadCommentsForPost(post.postID);
      loadLikesForPost(post.postID);
      
      // Trigger name fetch if owner is not in initial props.users and not saved on the post
      const ownerInProps = users[post.owner];
      const nameOnPost = post.firstName;
      
      // If the post is old (no name saved) and the user isn't locally known (hardcoded/current user)
      if (!nameOnPost && !ownerInProps && post.owner) {
        fetchUserName(post.owner);
      }
    });
  // The dependencies are posts (for initial loop) and users (if the parent fetches new user data)
  }, [posts, users]); 


  // -------------------------------------------------------------------
  // 2. User Name Fetching Function (Database Lookup)
  // -------------------------------------------------------------------

  /**
   * Fetches the first and last name for a given UID from the /users node
   * and caches the result in the local fetchedUsers state.
   * @param {string} uid - The Firebase User ID to look up.
   */
  const fetchUserName = async (uid) => {
    // If we've already tried to fetch it (is in cache), or if UID is invalid, exit.
    if (fetchedUsers[uid] || !uid) return;
    
    // Set a placeholder to prevent duplicate fetches while loading
    setFetchedUsers(prev => ({ ...prev, [uid]: { loading: true } }));
    
    try {
      // Assuming user details are stored under a 'users' node in the database
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        const nameData = {
          firstName: userData.firstName || "Anonymous",
          lastName: userData.lastName || "",
        };
        
        // Update the cache with the fetched name
        setFetchedUsers(prev => ({ 
          ...prev, 
          [uid]: nameData 
        }));
      } else {
        // Handle case where UID is found but user data is missing in /users
        setFetchedUsers(prev => ({ 
          ...prev, 
          [uid]: { firstName: "Unknown", lastName: "User" } 
        }));
      }
    } catch (error) {
      console.error(`Error fetching user ${uid}:`, error);
      // Set an error state in the cache for display
      setFetchedUsers(prev => ({ 
        ...prev, 
        [uid]: { firstName: "Error", lastName: "Loading" } 
      }));
    }
  };


  // -------------------------------------------------------------------
  // 3. Post Interaction Functions
  // -------------------------------------------------------------------

  const loadCommentsForPost = async (postID) => {
    try {
      const commentsRef = ref(database, `posts/${postID}/comments`);
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const commentsData = snapshot.val();
        // Convert Firebase object (if using push keys) or array to array
        const commentsArray = Array.isArray(commentsData) ? commentsData : Object.values(commentsData);
        setCommentsMap((prev) => ({
          ...prev,
          [postID]: commentsArray || [],
        }));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadLikesForPost = async (postID) => {
    try {
      const likesRef = ref(database, `posts/${postID}/likes`);
      const snapshot = await get(likesRef);
      if (snapshot.exists()) {
        const likesData = snapshot.val();
        setLikesMap((prev) => ({
          ...prev,
          [postID]: likesData || {},
        }));
      }
    } catch (error) {
      console.error("Error loading likes:", error);
    }
  };

  
  const toggleLike = async (postID) => {
    if (!currentUid) {
      console.log("Please log in to like posts");
      return;
    }

    setLikesMap((prev) => {
      const postLikes = prev[postID] || {};
      // Toggle the like status for the current user
      const liked = postLikes[currentUid]; 
      const updatedLikes = { ...postLikes };
      
      if (liked) {
          // If already liked, remove the like
          delete updatedLikes[currentUid];
      } else {
          // If not liked, add the like (using true as the value)
          updatedLikes[currentUid] = true;
      }

      // Save to Firebase
      // Note: Using update here is fine, but set would be clearer if you're replacing the whole likes node.
      update(ref(database, `posts/${postID}`), {
        likes: updatedLikes,
      }).catch((error) => console.error("Error updating likes:", error));

      return {
        ...prev,
        [postID]: updatedLikes,
      };
    });
  };


  const addComment = async (postID) => {
    const text = (commentInputs[postID] || "").trim();
    if (!text) return;

    // Use current user's details for the comment
    const newComment = {
      uid: currentUid || `anonymous-${Date.now()}`,
      firstName: currentUser?.firstName || "Anonymous",
      lastName: currentUser?.lastName || "",
      text: text,
      timestamp: Date.now(),
    };

    try {
      // Get existing comments to append the new one
      const commentsRef = ref(database, `posts/${postID}/comments`);
      const snapshot = await get(commentsRef);
      
      let updatedComments = [];
      if (snapshot.exists()) {
        const existingComments = snapshot.val();
        // Handle array or object structure from Firebase
        updatedComments = Array.isArray(existingComments) ? existingComments : Object.values(existingComments);
      }
      
      updatedComments.push(newComment);
      
      // Update Firebase with the new comments array
      await update(ref(database, `posts/${postID}`), {
        comments: updatedComments,
      });

      // Update local state immediately
      setCommentsMap((prev) => ({
        ...prev,
        [postID]: updatedComments,
      }));
      
      setCommentInputs((prev) => ({ ...prev, [postID]: "" }));
      setShowComments((prev) => ({ ...prev, [postID]: true })); // show comments after posting
    } catch (error) {
      alert("Error adding comment: " + error.message);
    }
  };

  
  const sharePost = (postID) => {
    const link = `${window.location.origin}/post?id=${postID}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => console.log("Post link copied to clipboard!"))
        .catch(() => {
          window.prompt("Copy this link:", link);
        });
    } else {
      window.prompt("Copy this link:", link);
    }
  };


  // -------------------------------------------------------------------
  // 4. Render Logic (With Enhanced Name Resolution)
  // -------------------------------------------------------------------

  return (
    <div className="post-container">
      {posts.length === 0 && <p className="muted">No posts yet.</p>}

      {posts.map((post) => {
        const postID = post.postID;
        
        // --- POST OWNER NAME RESOLUTION PRIORITY ---
        let owner = { firstName: post.firstName, lastName: post.lastName }; // 1. From post object (new posts)

        if (!owner.firstName && post.owner) {
          owner = users[post.owner]; // 2. From users prop (hardcoded/current user from parent)
        }

        if (!owner?.firstName && post.owner) {
            owner = fetchedUsers[post.owner]; // 3. From fetchedUsers cache (database lookup)
        }

        // 4. Final Fallback and Loading State
        const finalOwner = owner?.firstName 
            ? { firstName: owner.firstName, lastName: owner.lastName || "" }
            : { firstName: "Loading...", lastName: "" };
        
        // This check prevents displaying the email if it's being returned as a faulty 'firstName'
        if (finalOwner.firstName && finalOwner.firstName.includes('@')) {
            // If it looks like an email, force a database fetch and display "Loading..."
            fetchUserName(post.owner);
            finalOwner.firstName = "Loading...";
            finalOwner.lastName = "";
        }


        const postLikes = likesMap[postID] || {};
        const meLiked = currentUid ? !!postLikes[currentUid] : false;
        // Count only the keys where the value is truthy (or just count keys if you store UIDs)
        const likeCount = Object.keys(postLikes).filter((uid) => postLikes[uid]).length; 
        const postComments = commentsMap[postID] || [];

        return (
          <div className="post-card" key={postID}>
            <div className="profile">
              <img
                src={`https://avatar.iran.liara.run/username?username=${finalOwner.firstName}+${finalOwner.lastName}&background=000000&color=FFFFFF`}
                alt={`${finalOwner.firstName} ${finalOwner.lastName}`}
              />
              <h5>{finalOwner.firstName} {finalOwner.lastName}</h5>
            </div>

            <p className="post-content">{post.content}</p>

            
            <div className="post-actions">
              <button
                className={`btn-like ${meLiked ? "liked" : ""}`}
                onClick={() => toggleLike(postID)}
              >
                <i className="fa fa-thumbs-up" /> {likeCount}
              </button>

              <button
                className="btn-comment"
                onClick={() => setShowComments((prev) => ({ ...prev, [postID]: !prev[postID] }))}
              >
                <i className="fa fa-comment" /> {postComments.length}
              </button>

              <button
                className="btn-share"
                onClick={() => sharePost(postID)}
              >
                <i className="fa fa-share" />
              </button>

              {post.owner === currentUid && (
                <button
                  className="btn-delete"
                  onClick={() => deletePost(postID)}
                  title="Delete"
                >
                  <i className="fa fa-trash" />
                </button>
              )}
            </div>

          
            {showComments[postID] && (
              <div className="comments-panel">
                {postComments.length === 0 && <p className="muted">No comments yet.</p>}
                {postComments.map((c, idx) => {
                  const commenterUid = c.uid;
                  
                  // --- COMMENTER NAME RESOLUTION PRIORITY ---
                  let commenter = { firstName: c.firstName, lastName: c.lastName }; // 1. From comment object
                  
                  if (!commenter.firstName && commenterUid) {
                    commenter = users[commenterUid] || fetchedUsers[commenterUid]; // 2. From props or cache
                  }
                  
                  // If still missing, trigger a fetch for the commenter's name
                  if (!commenter?.firstName && commenterUid) {
                      fetchUserName(commenterUid);
                      commenter = { firstName: "Loading...", lastName: "" };
                  }
                  
                  // Final check for commenter's name
                  const finalCommenter = commenter?.firstName ? commenter : { firstName: "User", lastName: "" };

                  return (
                    <div className="comment-item" key={idx}>
                      <strong>{finalCommenter.firstName} {finalCommenter.lastName}:</strong> {c.text}
                    </div>
                  );
                })}
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[postID] || ""}
                    onChange={(e) => setCommentInputs((prev) => ({ ...prev, [postID]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") addComment(postID); }}
                  />
                  <button onClick={() => addComment(postID)} disabled={!commentInputs[postID]?.trim()}>Send</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PostList;