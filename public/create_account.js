document.getElementById('create-account-form').addEventListener('submit', function(event) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageElem = document.getElementById('message');

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    event.preventDefault();
    messageElem.textContent = 'Username can only contain letters and digits.';
    return;
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
  if (!passwordRegex.test(password)) {
    event.preventDefault();
    messageElem.textContent = 'Password must be at least 4 characters long, and include at least one letter and one digit.';
    return;
  }

  // Submit the form data via fetch
  event.preventDefault(); // Prevent the default form submission
  
  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
      method: form.method,
      body: formData
  })
  .then(response => response.text())
  .then(message => {
      messageElem.textContent = message;
      if (message.includes('Account created successfully')) {
          setTimeout(() => {
              window.location.href = '/login';
          }, 3000); // Redirect after 3 seconds
      }
  })
  .catch(error => {
      messageElem.textContent = 'An error occurred: ' + error.message;
  });
});
