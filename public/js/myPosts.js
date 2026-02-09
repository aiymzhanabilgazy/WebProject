let loggedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  await loadMyPosts();
});

async function loadUser() {
  const res = await fetch('/auth/me', { credentials: 'same-origin' });
  if (res.ok) loggedUser = await res.json();
}

async function loadMyPosts() {
  const res = await fetch('/api/posts/my', {
    credentials: 'same-origin'
  });

  if (!res.ok) return;

  const posts = await res.json();
  const container = document.getElementById('pinsContainer');
  const emptyState = document.getElementById('emptyState');

  container.innerHTML = '';

  if (!posts.length) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  posts.forEach(post => {
    container.innerHTML += renderPin(post, loggedUser);
  });
}
