let editingPostId = null;

document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openCreatePost');
  const overlay = document.getElementById('createOverlay');
  const closeBtn = document.getElementById('closeCreate');
  const submitBtn = document.getElementById('submitPost');

  if (!openBtn || !overlay || !closeBtn || !submitBtn) return;

  openBtn.onclick = () => {
    editingPostId = null;
    submitBtn.textContent = 'Publish';
    overlay.style.display = 'flex';
  };

  closeBtn.onclick = () => {
    editingPostId = null;
    submitBtn.textContent = 'Publish';
    overlay.style.display = 'none';
  };

  submitBtn.onclick = async () => {
    const author = document.getElementById('postAuthor').value.trim();
    const imageUrl = document.getElementById('postImage').value.trim();
    const description = document.getElementById('postDescription').value.trim();
    const categoryInput = document.getElementById('postCategory');

    if (!author || !imageUrl || !description) {
      alert('Fill all fields');
      return;
    }

    const payload = {
      author,
      imageUrl,
      description
    };

    if (categoryInput) {
      payload.category = categoryInput.value;
    }

    // ✏️ EDIT MODE
    if (editingPostId) {
      const res = await fetch(`/api/posts/${editingPostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert('Update failed');
        return;
      }

      overlay.style.display = 'none';
      editingPostId = null;
      location.reload();
      return;
    }

    // 🆕 CREATE MODE
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      overlay.style.display = 'none';
      location.reload();
    } else {
      alert('Login required');
    }
  };
});
