function openTab(event, tabName) {
  // Hide all tab contents
  const tabContents = document.getElementsByClassName("tab-content");
  for (const content of tabContents) {
    content.style.display = "none";
  }

  // Remove active class from all tab buttons
  const tabButtons = document.getElementsByClassName("tab-button");
  for (const button of tabButtons) {
    button.classList.remove("active");
  }

  // Show the selected tab content and mark the button as active
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
}

// Show the default tab on page load
document.getElementById("tab2").style.display = "block";
document.querySelectorAll(".tab-button")[1].classList.add("active");
