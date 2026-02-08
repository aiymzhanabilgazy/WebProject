let loggedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadAuth();
  await loadSavedPins();
});

async function loadAuth() {
  const res = await fetch('/auth/me', {
    credentials: 'same-origin'
  });

  if (!res.ok) return;
  loggedUser = await res.json();
}

async function loadSavedPins() {
  const res = await fetch('/api/posts/saved', {
    credentials: 'same-origin'
  });

  if (!res.ok) {
    console.error('Not authorized');
    return;
  }

  const posts = await res.json();

  const container = document.getElementById('pinsContainer');
  container.innerHTML = '';

  if (posts.length === 0) {
    container.innerHTML = '<p>No saved pins yet 💔</p>';
    return;
  }

  posts.forEach(post => {
    container.innerHTML += renderPin(post, loggedUser);
  });
}
