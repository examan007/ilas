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

    var CurrentSection = "Home"

    function changeSection(newsection) {
        var newsectionobj = $("#" + newsection)
        console.log(newsectionobj)
        if (newsectionobj.length === 0) {
            console.log("Section=[" + newsection + "] not found!")
        } else {
            $("#" + CurrentSection).css("display", "none");
            newsectionobj.css("display", "block");
            CurrentSection = newsection
        }
    }

    function menuClick(obj) {
        console.log('Getting menu item.')
        console.log('obj=[' + obj.innerHTML + ']')
        var element = $(obj.innerHTML)
        var sectionname = $('span', element).text()
        console.log("link name=[" + sectionname + "]")
        changeSection(sectionname.replace(/ /g,"_"))
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

