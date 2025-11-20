import React, { useState, useEffect } from "react";
import "./post-list.css";
import { database } from "../../firebase-config";
import { ref, update, get } from "firebase/database";

function PostList({ posts, users, currentUser, deletePost }) {

  const [likesMap, setLikesMap] = useState({}); 
  const [commentsMap, setCommentsMap] = useState({}); 
  const [commentInputs, setCommentInputs] = useState({}); 
  const [showComments, setShowComments] = useState({});
  const currentUid = currentUser?.uid || null;

  // Load comments and likes from Firebase when posts change
  useEffect(() => {
    posts.forEach((post) => {
      loadCommentsForPost(post.postID);
      loadLikesForPost(post.postID);
    });
  }, [posts]);

  const loadCommentsForPost = async (postID) => {
    try {
      const commentsRef = ref(database, `posts/${postID}/comments`);
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const commentsData = snapshot.val();
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
      alert("Please log in to like posts");
      return;
    }

    setLikesMap((prev) => {
      const postLikes = prev[postID] || {};
      const liked = postLikes[currentUid];
      const updatedLikes = {
        ...postLikes,
        [currentUid]: !liked,
      };

      // Save to Firebase
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
    if (!currentUid) {
      alert("Please log in to comment");
      return;
    }

    const text = (commentInputs[postID] || "").trim();
    if (!text) return;

    const newComment = {
      uid: currentUid,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      text: text,
      timestamp: Date.now(),
    };

    try {
      // Save comment to Firebase
      const commentsRef = ref(database, `posts/${postID}/comments`);
      const snapshot = await get(commentsRef);
      
      let updatedComments = [];
      if (snapshot.exists()) {
        const existingComments = snapshot.val();
        updatedComments = Array.isArray(existingComments) ? existingComments : Object.values(existingComments);
      }
      
      updatedComments.push(newComment);
      
      // Update Firebase with new comments array
      await update(ref(database, `posts/${postID}`), {
        comments: updatedComments,
      });

      // Update local state
      setCommentsMap((prev) => ({
        ...prev,
        [postID]: updatedComments,
      }));
      
      setCommentInputs((prev) => ({ ...prev, [postID]: "" }));
      setShowComments((prev) => ({ ...prev, [postID]: true }));
    } catch (error) {
      alert("Error adding comment: " + error.message);
    }
  };

  
  const sharePost = (postID) => {
    const link = `${window.location.origin}/post?id=${postID}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => alert("Post link copied to clipboard!"))
        .catch(() => {
          window.prompt("Copy this link:", link);
        });
    } else {
      window.prompt("Copy this link:", link);
    }
  };

  return (
    <div className="post-container">
      {posts.length === 0 && <p className="muted">No posts yet.</p>}

      {posts.map((post) => {
        const owner = users[post.owner] || { firstName: post.firstName, lastName: post.lastName };
        if (!owner || !owner.firstName) return null;

        const postID = post.postID;
        const postLikes = likesMap[postID] || {};
        const meLiked = !!postLikes[currentUser.uid];
        const likeCount = Object.keys(postLikes).filter((uid) => postLikes[uid]).length;

        const postComments = commentsMap[postID] || [];

        return (
          <div className="post-card" key={postID}>
            <div className="profile">
              <img
                src={`https://avatar.iran.liara.run/username?username=${owner.firstName}+${owner.lastName}&background=000000&color=FFFFFF`}
                alt={`${owner.firstName} ${owner.lastName}`}
              />
              <h5>{owner.firstName} {owner.lastName}</h5>
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

              {post.owner === currentUser.uid && (
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
                  const commenter = users[c.uid] || { firstName: c.firstName || "User", lastName: c.lastName || "" };
                  return (
                    <div className="comment-item" key={idx}>
                      <strong>{commenter.firstName} {commenter.lastName}:</strong> {c.text}
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
                  <button onClick={() => addComment(postID)}>Send</button>
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
