document.getElementById('submitPost').addEventListener('click', async () => {
  const postData = {
    author: document.getElementById('postAuthor').value.trim(),
    imageUrl: document.getElementById('postImage').value.trim(),
    description: document.getElementById('postDescription').value.trim(),
    category: document.getElementById('postCategory').value
  };

  if (!postData.author || !postData.imageUrl || !postData.description) {
    alert('Fill all fields');
    return;
  }

  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(postData)
  });

  if (res.ok) {
    document.getElementById('createOverlay').style.display = 'none';
    location.reload();
  } else {
    alert('Login required');
  }
});