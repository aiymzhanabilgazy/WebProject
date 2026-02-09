const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) {
  alert('User not found');
  location.href = '/admin';
}

async function loadUserAndPosts() {
  const res = await fetch(`/api/admin/users/${userId}`, {
    credentials: 'same-origin'
  });

  if (!res.ok) {
    alert('Access denied');
    location.href = '/admin';
    return;
  }

  const { user, posts } = await res.json();

  renderUser(user);
  renderPosts(posts);
}

// 👤 USER INFO
function renderUser(user) {
  const container = document.getElementById('userInfo');

  const name =
    user.name ||
    user.email?.split('@')[0] ||
    'User';

  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">
        ${name.charAt(0).toUpperCase()}
      </div>

      <div class="profile-info">
        <h2>${name}</h2>
        <p>${user.email || ''}</p>
        <span class="role-badge ${user.role}">
          ${user.role}
        </span>
      </div>
    </div>
  `;
}

// 📌 POSTS
function renderPosts(posts) {
  const container = document.getElementById('userPosts');
  container.innerHTML = '';

  if (!posts || posts.length === 0) {
    container.innerHTML = `<p class="empty">No posts yet</p>`;
    return;
  }

  posts.forEach(post => {
    container.innerHTML += `
      <div class="post-card">
        ${post.imageUrl ? `<img src="${post.imageUrl}" />` : ''}

        <div class="post-body">
          <p>${post.description}</p>
          <small>${post.category || ''}</small>
        </div>
      </div>
    `;
  });
}

loadUserAndPosts();
