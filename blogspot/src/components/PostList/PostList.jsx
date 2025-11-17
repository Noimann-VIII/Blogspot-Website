import React, { useState } from "react";
import "./post-list.css";

function PostList({ posts, users, currentUser, deletePost }) {

  const [likesMap, setLikesMap] = useState({}); 
  const [commentsMap, setCommentsMap] = useState({}); 
  const [commentInputs, setCommentInputs] = useState({}); 
  const [showComments, setShowComments] = useState({}); 

  
  const toggleLike = (postID) => {
    setLikesMap((prev) => {
      const postLikes = prev[postID] || {};
      const liked = postLikes[currentUser.uid];
      return {
        ...prev,
        [postID]: {
          ...postLikes,
          [currentUser.uid]: !liked,
        },
      };
    });
  };


  const addComment = (postID) => {
    const text = (commentInputs[postID] || "").trim();
    if (!text) return;
    setCommentsMap((prev) => {
      const postComments = prev[postID] || [];
      return { ...prev, [postID]: [...postComments, { uid: currentUser.uid, text }] };
    });
    setCommentInputs((prev) => ({ ...prev, [postID]: "" }));
    setShowComments((prev) => ({ ...prev, [postID]: true }));
  };

  
  const sharePost = (postID) => {
    const link = `${window.location.origin}/post/${postID}`;
    navigator.clipboard?.writeText(link)
      .then(() => alert("Post link copied to clipboard!"))
      .catch(() => window.prompt("Copy this link:", link));
  };

  return (
    <div className="post-container">
      {posts.length === 0 && <p className="muted">No posts yet.</p>}

      {posts.map((post) => {
        const owner = users[post.owner];
        if (!owner) return null;

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
                  const commenter = users[c.uid] || { firstName: "User", lastName: "" };
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
