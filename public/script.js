function updateDateTime() {
    var now = new Date();
    var dateString = now.toLocaleDateString();
    var timeString = now.toLocaleTimeString();
    document.getElementById('dateTime').textContent = dateString + ' ' + timeString;
  }
  
  setInterval(updateDateTime, 1000);
  updateDateTime(); // Initial call to set the date and time immediately
  