import React, { useState, useEffect } from "react";
import "./post-list.css";
import { database } from "../../firebase-config";
import { ref, update, get } from "firebase/database";

function PostList({ posts, users, currentUser, deletePost }) {
  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [fetchedUsers, setFetchedUsers] = useState({});

  const currentUid = currentUser?.uid || null;

  useEffect(() => {
    posts.forEach((post) => {
      loadCommentsForPost(post.postID);
      loadLikesForPost(post.postID);

      const ownerInProps = users[post.owner];
      const nameOnPost = post.firstName;

      if (!nameOnPost && !ownerInProps && post.owner) {
        fetchUserName(post.owner);
      }
    });
  }, [posts, users]);

  const fetchUserName = async (uid) => {
    if (fetchedUsers[uid] || !uid) return;

    setFetchedUsers((prev) => ({ ...prev, [uid]: { loading: true } }));

    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        const nameData = {
          firstName: userData.firstName || "Anonymous",
          lastName: userData.lastName || "",
        };

        setFetchedUsers((prev) => ({
          ...prev,
          [uid]: nameData,
        }));
      } else {
        setFetchedUsers((prev) => ({
          ...prev,
          [uid]: { firstName: "Unknown", lastName: "User" },
        }));
      }
    } catch (error) {
      console.error(`Error fetching user ${uid}:`, error);
      setFetchedUsers((prev) => ({
        ...prev,
        [uid]: { firstName: "Error", lastName: "Loading" },
      }));
    }
  };

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
      console.log("Please log in to like posts");
      return;
    }

    setLikesMap((prev) => {
      const postLikes = prev[postID] || {};
      const liked = postLikes[currentUid];
      const updatedLikes = { ...postLikes };

      if (liked) {
        delete updatedLikes[currentUid];
      } else {
        updatedLikes[currentUid] = true;
      }

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

    const newComment = {
      uid: currentUid || `anonymous-${Date.now()}`,
      firstName: currentUser?.firstName || "Anonymous",
      lastName: currentUser?.lastName || "",
      text: text,
      timestamp: Date.now(),
    };

    try {
      const commentsRef = ref(database, `posts/${postID}/comments`);
      const snapshot = await get(commentsRef);

      let updatedComments = [];
      if (snapshot.exists()) {
        const existingComments = snapshot.val();
        updatedComments = Array.isArray(existingComments) ? existingComments : Object.values(existingComments);
      }

      updatedComments.push(newComment);

      await update(ref(database, `posts/${postID}`), {
        comments: updatedComments,
      });

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
      navigator.clipboard
        .writeText(link)
        .then(() => console.log("Post link copied to clipboard!"))
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
        const postID = post.postID;

        let owner = { firstName: post.firstName, lastName: post.lastName };

        if (!owner.firstName && post.owner) {
          owner = users[post.owner];
        }

        if (!owner?.firstName && post.owner) {
          owner = fetchedUsers[post.owner];
        }

        const finalOwner = owner?.firstName
          ? { firstName: owner.firstName, lastName: owner.lastName || "" }
          : { firstName: "Loading...", lastName: "" };

        if (finalOwner.firstName && finalOwner.firstName.includes("@")) {
          fetchUserName(post.owner);
          finalOwner.firstName = "Loading...";
          finalOwner.lastName = "";
        }

        const postLikes = likesMap[postID] || {};
        const meLiked = currentUid ? !!postLikes[currentUid] : false;
        const likeCount = Object.keys(postLikes).filter((uid) => postLikes[uid]).length;
        const postComments = commentsMap[postID] || [];

        return (
          <div className="post-card" key={postID}>
            <div className="profile">
              <img
                src={`https://avatar.iran.liara.run/username?username=${finalOwner.firstName}+${finalOwner.lastName}&background=000000&color=FFFFFF`}
                alt={`${finalOwner.firstName} ${finalOwner.lastName}`}
              />
              <h5>
                {finalOwner.firstName} {finalOwner.lastName}
              </h5>
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
                onClick={() =>
                  setShowComments((prev) => ({ ...prev, [postID]: !prev[postID] }))
                }
              >
                <i className="fa fa-comment" /> {postComments.length}
              </button>

              <button className="btn-share" onClick={() => sharePost(postID)}>
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

                  let commenter = { firstName: c.firstName, lastName: c.lastName };

                  if (!commenter.firstName && commenterUid) {
                    commenter = users[commenterUid] || fetchedUsers[commenterUid];
                  }

                  if (!commenter?.firstName && commenterUid) {
                    fetchUserName(commenterUid);
                    commenter = { firstName: "Loading...", lastName: "" };
                  }

                  const finalCommenter = commenter?.firstName
                    ? commenter
                    : { firstName: "User", lastName: "" };

                  return (
                    <div className="comment-item" key={idx}>
                      <strong>
                        {finalCommenter.firstName} {finalCommenter.lastName}:
                      </strong>{" "}
                      {c.text}
                    </div>
                  );
                })}
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[postID] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [postID]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addComment(postID);
                    }}
                  />
                  <button onClick={() => addComment(postID)} disabled={!commentInputs[postID]?.trim()}>
                    Send
                  </button>
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