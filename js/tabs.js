var TabManager = function() {
    var console = {
        log: function(msg) {},
    }
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
      document.getElementById(tabName).style.display = "flex";
      event.currentTarget.classList.add("active");

      const tabnumber = parseInt(tabName.match(/\d+/)[0]);

      const newState = { page: "newpage" }
      const newTitle = "Services"
      function getNewURL() {
          const tab = AppMan.getQueryValue('nomenuflag')

      }
      const newUrl = "#?tab=" + tabnumber

      history.pushState(newState, newTitle, newUrl);
    }

    function defaultTab(number) {
        try {
            document.getElementById("tab" + number).style.display = "flex";
            document.querySelectorAll(".tab-button")[number - 1].classList.add("active");
        } catch (e) {
            console.log(e.stack.toString())
        }
    }
    return {
        openTab: function (event, tabName) {
            return openTab(event, tabName)
        },
        defaultTab: function (number) {
            return defaultTab(number)
        }
    }
}