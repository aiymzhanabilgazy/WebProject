let loggedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadAuth();
  await loadLikedPins();
});

/* =====================
   AUTH
===================== */
async function loadAuth() {
  const res = await fetch('/auth/me', {
    credentials: 'same-origin' // 🔥 ОБЯЗАТЕЛЬНО
  });

  if (!res.ok) {
    alert('Login required to see liked pins');
    window.location.href = '/auth';
    return;
  }

  loggedUser = await res.json();
  console.log('LOGGED USER:', loggedUser);
}

/* =====================
   LOAD LIKED POSTS
===================== */
async function loadLikedPins() {
  const res = await fetch('/api/posts/liked', {
    credentials: 'same-origin' // 🔥 ВОТ ЭТОГО НЕ ХВАТАЛО
  });

  if (!res.ok) {
    alert('Failed to load liked pins');
    return;
  }

  const posts = await res.json();

  const container = document.getElementById('pinsContainer');
  container.innerHTML = '';

  if (posts.length === 0) {
    container.innerHTML = '<p>You have no liked pins yet ❤️</p>';
    return;
  }

  posts.forEach(post => {
    container.innerHTML += renderPin(post, loggedUser);
  });
}
