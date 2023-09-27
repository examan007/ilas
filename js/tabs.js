var TabManager = function(AppMan) {
    var console = {
        log: function(msg) {},
    }
    function pushState(tabName) {
      const tabnumber = parseInt(tabName.match(/\d+/)[0])
      const newState = { page: "newpage" }
      const newTitle = "Services"
      const newUrl = AppMan.getServerURL() + "?" + AppMan.replaceQueryValue("tab", tabnumber)
      history.pushState(newState, newTitle, newUrl);
    }
    function selectTab(tabName) {
      const tabnumber = parseInt(tabName.match(/\d+/)[0])
      // Hide all tab contents
      const tabContents = document.getElementsByClassName("tab-content");
      var number = 0
      for (const content of tabContents) {
        content.style.display = "none";
        if (number === tabnumber) {
            content.style.display = "flex"
        }
        number = number + 1
      }

      // Remove active class from all tab buttons
      const tabButtons = document.getElementsByClassName("tab-button");
      for (const button of tabButtons) {
        button.classList.remove("active");
        if (button.getAttribute("name") === tabName) {
            button.classList.add("active");
        }
      }
    }
    function openTab(tabName) {
        selectTab(tabName)
        pushState(tabName)
    }

    function registerTabEvents() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach((tab)=> {
            const name = tab.getAttribute("name")
            tab.addEventListener('click', (event) => {
                openTab(name)
            })
        })
    }
    registerTabEvents()

    return {
        defaultTab: function (number) {
            return selectTab("tab" + number)
        }
    }
}