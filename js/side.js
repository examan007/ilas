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
        var sidebarwidth = $('.sidebar').width()
        sidebarwidth += 54
        console.log("resize before setting width sbw=[" + sidebarwidth + "]")
 //       $('#menu-space').width(sidebarwidth)
        console.log("resize after setting width.")
    }
      function resizeScreen() {
        if(document.body.clientWidth < 400){
          $('.sidebar').addClass('close');
          toggleSidebar()
        }else{
          $('.sidebar').removeClass('close');
        }

        console.log("resize before setting width.")
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

    function menuClick(obj) {
        console.log('Getting menu item.')
        console.log('obj.class=[' + obj.class + ']')

    }

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

