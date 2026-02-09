let loggedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadAuth();
  await loadLocationPins(); // или loadCreativityPins / loadHomePins
});

async function loadAuth() {
  const res = await fetch('/auth/me', {
    credentials: 'same-origin'
  });

  if (!res.ok) {
    loggedUser = null;
    return;
  }

  loggedUser = await res.json();
  console.log('LOGGED USER:', loggedUser); // ← тут ДОЛЖЕН быть _id
}


/* =====================
   LOAD LOCATIONS POSTS
===================== */
async function loadLocationPins() {
  const res = await fetch('/api/posts', {
    credentials: 'same-origin'
  });

  if (!res.ok) {
    console.error('Failed to load posts');
    return;
  }

  const data = await res.json();
  const posts = data.posts; // 🔥 ВОТ ЭТО ГЛАВНОЕ

  const container = document.getElementById('pinsContainer');
  container.innerHTML = '';

  posts
    .filter(post => post.category === 'locations')
    .forEach(post => {
      container.innerHTML += renderPin(post, loggedUser);
    });
}


/* =====================
   DELETE
===================== */
async function deletePost(id) {
  const confirmDelete = confirm('Are you sure you want to delete this post?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });

    if (!res.ok) {
      alert('Failed to delete post');
      return;
    }

    // 🔥 Удаляем пин из DOM
    const pinElement = document.getElementById(`pin-${id}`);
    if (pinElement) {
      pinElement.remove();
    }

  } catch (err) {
    console.error(err);
    alert('Error while deleting post');
  }
}


async function editPost(id) {
  editingPostId = id;

  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) {
    alert('Failed to load post');
    return;
  }

  const post = await res.json();

  document.getElementById('postAuthor').value = post.author;
  document.getElementById('postImage').value = post.imageUrl;
  document.getElementById('postDescription').value = post.description;

  document.getElementById('submitPost').textContent = 'Update';
  document.getElementById('createOverlay').style.display = 'flex';
}
async function toggleLike(postId, icon) {
  try {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'same-origin'
    });

    if (!res.ok) {
      showToast('Please login to like');
      return;
    }

    const data = await res.json();

    if (data.liked) {
      icon.name = 'heart';
      icon.classList.add('liked');
      showToast('❤️ You liked this pin');
    } else {
      icon.name = 'heart-outline';
      icon.classList.remove('liked');
      showToast('💔 Like removed');
    }
  } catch (err) {
    console.error(err);
    showToast('Error while liking');
  }
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

async function toggleSave(postId, icon) {
  const res = await fetch(`/api/posts/${postId}/save`, {
    method: 'POST',
    credentials: 'same-origin'
  });

  if (!res.ok) {
    alert('Login required');
    return;
  }

  const data = await res.json();

  if (data.saved) {
    icon.name = 'bookmark';
    icon.classList.add('saved');
    showToast('📌 Saved');
  } else {
    icon.name = 'bookmark-outline';
    icon.classList.remove('saved');
    showToast('❌ Removed from saved');
  }
}