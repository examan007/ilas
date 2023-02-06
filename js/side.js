    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
      });
    }
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".bx-menu");
    console.log(sidebarBtn);
//    $('.sidebar').toggleClass('close');

    /* sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    }); */
   function toggleSidebar() {
      if(document.body.clientWidth > 400){
          console.log("click to close")

             var classobj = $('.sidebar').attr("class");
             console.log(classobj);
             console.log(JSON.stringify($('.sidebar')))
        $('.sidebar').toggleClass('close');
      }else{
        console.log("small-screen")
        $('.sidebar').toggleClass('small-screen');
      }
    }
      function resizeScreen() {
        if(document.body.clientWidth < 400){
          $('.sidebar').addClass('close');
          toggleSidebar()
        }else{
          $('.sidebar').removeClass('close');
        }
      }

    $(function () {
      /* console.log("width: "+ document.body.clientWidth); */

//      resizeScreen();
      $(window).resize(function(){
        resizeScreen();
      });
      $('.bx-menu').click(function(){
        toggleSidebar()
      });


    });

      function welcomeFunction() {
          console.log('page is loaded icons');
          $.each($('.sidebar'), function(index, val) {
              console.log(val);
          });
          var classobj = $('.sidebar').attr("class");
          console.log(classobj);
          resizeScreen();
          toggleSidebar()
          document.body.style.cursor = "default";
          console.log("cursor style is " + document.body.style.cursor)
      }

