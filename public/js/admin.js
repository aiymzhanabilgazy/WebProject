async function loadUsers() {
  const res = await fetch('/api/admin/users', {
    credentials: 'same-origin'
  });

  if (!res.ok) {
    alert('Access denied');
    return;
  }

  const users = await res.json();
  const container = document.getElementById('usersContainer');
  container.innerHTML = '';

  users.forEach(user => {
    const name =
      user.name ||
      user.email?.split('@')[0] ||
      'User';

    const role = user.role || 'user';

    container.innerHTML += `
      <div class="user-card" onclick="openUser('${user._id}')">
        <div class="user-avatar">
          ${name.charAt(0).toUpperCase()}
        </div>

        <div class="user-info">
          <div class="user-name">${name}</div>
          <div class="user-email">${user.email || '—'}</div>
        </div>

        <div class="user-role ${role}">
          <ion-icon name="${
            role === 'admin'
              ? 'shield-checkmark-outline'
              : 'person-outline'
          }"></ion-icon>
          ${role}
        </div>
      </div>
    `;
  });
}

// 🔥 ВАЖНО: функция в глобальной области
function openUser(userId) {
  window.location.href = `/admin-user.html?id=${userId}`;
}

loadUsers();
