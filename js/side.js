    var SidebarState = "Minimized"
    function toggleSidebarAlone() {
        if (SidebarState === 'Minimized') {
          $('.sidebar').css('width', '0px')
          $('.icon-link').css('display', 'none');
          $('.logo-details').css('display', 'none')
          $('.sidebar').addClass('close');
          SidebarState = "Hidden"
        }
    }
    function showStack() {
        function foo() {
          throw new Error('Show stack trace.');
        }
        function bar() {
          foo();
        }
        function baz() {
          bar();
        }
        try {
          baz();
        } catch (e) {
          console.error(e.stack);
        }
    }
   var InitialMargin = 260
   function toggleSidebar(flag) {
      var NewSidebarState = null
      if (typeof(flag) !== 'undefined') {
        if (flag == true) {
           SidebarState = "Submenu"
        } else
        if (SidebarState === "Hidden") {
           NewSidebarState = "Hidden"
        } else {
           NewSidebarState = "Minimized"
        }
      } else
      if (SidebarState === "Submenu") {
        NewSidebarState = "Submenu"
      } else
      if (SidebarState === "Hidden") {
        NewSidebarState = "Maximized"
      } else
      if (SidebarState === "Minimized") {
        NewSidebarState = "Maximized"
      } else
      if (SidebarState === "Maximized") {
        NewSidebarState = "Minimized"
      } else
      if (SidebarState === "Hidden") {
        NewSidebarState = "Maximized"
      }
      clearTimeout(SidebarTimeoutObj)
      console.log("NewSidebarState=[" + NewSidebarState + "]")
      showStack()
      if (SidebarState === "Submenu") {
        $('.sidebar').addClass('close');
        $('.sidebar').css('width', '78px')
      } else
      if (NewSidebarState === "Maximized") {
        $('.sidebar').removeClass('close');
        $('.sidebar').css('width', '260px')
        $('.icon-link').css('display', 'flex');
        $('.logo-details').css('display', 'flex')
        SidebarState = NewSidebarState
      } else
      if (NewSidebarState === "Minimized") {
        $('.sidebar').addClass('close');
        $('.sidebar').css('width', '78px')
        $('.icon-link').css('display', 'inline-block');
        $('.logo-details').css('display', 'inline-block')
        SidebarTimeoutObj = setTimeout(toggleSidebarAlone, 3000)
        SidebarState = NewSidebarState
      }
      ret = ! $('.sidebar').hasClass('close')

        return ret
    }

      function resizeScreen() {
        if (1) { //document.body.clientWidth < 400){
          $('.sidebar').addClass('close');
          //toggleSidebar()
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
        function testDomobj(elementid) {
            return $('#' + elementid)
        }
        function getsectionobj() {
            try {
                if ( newsection === "Services" ) {
                    return testDomobj('Home')
                } else
                if (newsection.length > 0) {
                    return testDomobj(newsection)
                } else {
                    return testDomobj('Home')
                }
            } catch (e) {
                console.log(e.toString())
            }
            return testDomobj('Home')
        }
        const newsectionobj = getsectionobj()
        $("#" + CurrentSection).css("display", "none");
         if (newsection === "Home" || newsection.length == 0 || newsection == "Booking") {
             $('.wideportal').css("display", "block")
             $('.wideobject').css("display", "block")
             console.log("#%#$%##$%#% Change section to [" + newsection + "]")
         } else {
             $('.wideportal').css("display", "none")
             $('.wideobject').css("display", "none")
             console.log(">>>>>>>>>>>>> Change section to [" + newsection + "]")
         }
        newsectionobj.css("display", "block");
        if (newsection.length > 0) {
            CurrentSection = newsection
        } else {
            CurrentSection = "Home"
        }
         if (newsection === "Booking") {
            console.log("testCookie for Booking.")
            testCookie((token)=> {
                if (token == null) {
                    $('#login').css("display", "block")
                    $('#login').on('click', function() {
                          console.log('login was clicked!')
                          toggleSidebar(false)
                    })
                } else {
                    $('#login').css("display", "none")
                }
            })
        }
        newsectionobj.on('click', function() {
          console.log('close sidebar!')
          toggleSidebar(false)
        })
//        resizeScreen();
//        $('.sidebar').addClass('close')
//        $('section').css("margin-left", "" + 78 + "px")

    }

    function menuClick(obj) {
        console.log('Getting menu item.')
        console.log('obj=[' + obj.innerHTML + ']')
        var element = $($(obj.innerHTML)).find("a:first")
        var sectionname = element.attr('href')
        if (typeof(sectionname) === "undefined") {
            console.log("element")
           sectionname=$(obj.innerHTML).attr('href')
        }
        sectionname = sectionname.substring(1).split("?")[0]
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
//          resizeScreen();
//          toggleSidebar()
          document.body.style.cursor = "default";
          console.log("cursor style is " + document.body.style.cursor)

          const currentUrl = window.location.href;
          console.log("Current URL = [" + currentUrl + "]")

          const hashValue = getHashValue()
          if ( typeof(hashValue) === 'undefined' ) {
              changeSection('Home')
          } else
          if (hashValue.length <= 0) {
              changeSection('Home')
          } else {
              console.log("hashValue=[" + hashValue + "]")
              changeSection(removeLeadingChar(hashValue, "#"))
          }
          SidebarTimeoutObj = setTimeout(toggleSidebarAlone, 3000)
      }

function FindPosition(oElement)
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}

function GetCoordinates(e)
{
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(myImg);
  if (!e) var e = window.event;
  if (e.pageX || e.pageY)
  {
    PosX = e.pageX;
    PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
    {
      PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];
  console.log("X=[" + PosX + "] Y=[" + PosY + "]")
}

