let loggedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadAuth();
  await loadCreativityPins(); 
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
  console.log('LOGGED USER:', loggedUser); 
}



//delete
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
let allCreativityPosts = [];

loadCreativityPins = async function () {
  const res = await fetch('/api/posts', { credentials: 'same-origin' });
  if (!res.ok) return;

  const data = await res.json();


  allCreativityPosts = data.posts.filter(
    p => p.category === 'creativity'
  );

  renderCategory('all');
};

function renderCategory(type) {
  const container = document.getElementById('pinsContainer');
  container.innerHTML = '';

  const filtered = type === 'all'
    ? allCreativityPosts
    : allCreativityPosts.filter(p => p.type === type);

  filtered.forEach(post => {
    container.innerHTML += renderPin(post, loggedUser);
  });
}

document.addEventListener('click', e => {
  if (!e.target.classList.contains('filter-btn')) return;

  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));

  e.target.classList.add('active');

  renderCategory(e.target.dataset.category);
});
