function renderPin(post, loggedUser) {
  const isOwner =
    loggedUser &&
    loggedUser._id &&
    post.userId.toString() === loggedUser._id.toString();

  const isLiked =
    loggedUser &&
    post.likes?.some(id => id.toString() === loggedUser._id.toString());

  const isSaved =
    loggedUser &&
    post.saved?.some(id => id.toString() === loggedUser._id.toString());

  return `
    <div class="pin polaroid" id="pin-${post._id}">
      <img src="${post.imageUrl}" alt="">

      <div class="pin-info">
        <p class="author">${post.author}</p>
        <p class="story">${post.description}</p>

        <div class="pin-actions">
          <ion-icon
            name="${isLiked ? 'heart' : 'heart-outline'}"
            class="like-icon ${isLiked ? 'liked' : ''}"
            onclick="toggleLike('${post._id}', this)">
          </ion-icon>

          <ion-icon
            name="${isSaved ? 'bookmark' : 'bookmark-outline'}"
            class="save-icon ${isSaved ? 'saved' : ''}"
            onclick="toggleSave('${post._id}', this)">
          </ion-icon>

          ${isOwner ? `
            <ion-icon name="create-outline"
              onclick="editPost('${post._id}')"></ion-icon>

            <ion-icon name="trash-outline"
              onclick="deletePost('${post._id}')"></ion-icon>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
