
   var InitialMargin = 260
   function toggleSidebar(flag) {
      if (typeof(flag) === 'undefined') { flag = true }
      if ($('.sidebar').hasClass('close') && !flag) {
        console.log('Already closed');
      } else
      if (1) { //document.body.clientWidth > 400){
         console.log("click to close")
         var classobj = $('.sidebar').attr("class");
         console.log(classobj);
         console.log(JSON.stringify($('.sidebar')))
        $('.sidebar').toggleClass('close');
      }else{
        console.log("small-screen")
        $('.sidebar').toggleClass('small-screen');
      }
      function adjustSidebarwidth() {
        var sidebarwidth = $('.sidebar').width() + InitialMargin
        InitialMargin = 0
        if (sidebarwidth >= 260) {
            sidebarwidth = 78
        } else {
            sidebarwidth = 260
        }
        console.log("resize before setting width sbw=[" + sidebarwidth + "]")
        $('section').css("margin-left", "" + sidebarwidth + "px")
       }

        console.log("resize after setting width.")
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
            return testDomobj('#Home')
        }
        const newsectionobj = getsectionobj()
        $("#" + CurrentSection).css("display", "none");
        newsectionobj.css("display", "block");
        CurrentSection = newsection
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
        resizeScreen();
        $('.sidebar').addClass('close')
        $('section').css("margin-left", "" + 78 + "px")

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
          resizeScreen();
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

