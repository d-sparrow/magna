const loginForm = document.getElementById('login');
const adminPanel = document.getElementById('adminPanel');
const userList = document.getElementById('userList');
const addUserForm = document.getElementById('addUser');

let token = null;

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    token = data.access_token;
    loginForm.style.display = 'none';
    adminPanel.style.display = 'block';
  } else {
    alert(data.msg);
  }
});

// Load users
document.getElementById('loadUsers').addEventListener('click', async () => {
  const response = await fetch('http://localhost:5000/users', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const users = await response.json();
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.username} (${user.role})`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteUser(user.id));
    li.appendChild(deleteBtn);
    userList.appendChild(li);
  });
});

// Add user
addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;
  const newRole = document.getElementById('newRole').value;

  const response = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
  });

  const data = await response.json();
  if (response.ok) {
    alert('User added successfully');
    addUserForm.reset();
  } else {
    alert(data.msg);
  }
});

// Delete user
async function deleteUser(userId) {
  const response = await fetch(`http://localhost:5000/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (response.ok) {
    alert(data.msg);
  } else {
    alert(data.msg);
  }
}