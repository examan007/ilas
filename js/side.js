    var SidebarState = "Minimized"
    var LoginFlag = false
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
    function getWindowDimensions () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        //console.log(`Window size is ${width}x${height}`);
        return {
            width: width,
            height: height,
        }
    }

   var timeoutobj = null
   var timeoutflag = true
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
      window.clearTimeout(timeoutobj)
      timeoutflag = false
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
        const dimensions = getWindowDimensions()
        //console.log("resize with new width =[" + dimensions.width + "]")
        $('.wrapper').css("width", "" + dimensions.width + "px")
        if (dimensions.width > 550) {
            $('.wideportal').css("width", "" + (dimensions.width - 550) + "px")
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

    var CurrentSection = "Home"
    function getLoginWindow(operation) {
        const messageobj = {
            operation: operation,
        }
        $('#login').css("display", "block")
        $('#login').on('click', function() {
              console.log('login was clicked!')
              toggleSidebar(false)
        })
        var objectEl = document.getElementById('login');
        if (objectEl.contentWindow != null) {
          function sendMessage(message) {
              objectEl.contentWindow.postMessage(message, "*");
              console.log("To login window message posted [" + message + "]")
          }
          sendMessage(JSON.stringify(messageobj))
         }
    }
    function changeSection(newsection) {
        function testDomobj(elementid) {
            return $('#' + elementid)
        }
        function getsectionobj() {
            try {
                if ( newsection === "Services" ) {
                    return testDomobj('Home')
                } else
                if ( newsection === "Settings" ) {
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
        function getsectionname() {
            if (newsection.length > 0) {
                return newsection
            } else {
                return "Home"
            }
        }
        const newsectionobj = getsectionobj()
        const dimensions = getWindowDimensions()
        $('.wrapper').css("width", "" + (dimensions.width) + "px")
        $('.wideportal').css("width", "" + (dimensions.width - 550) + "px")
        $("#" + CurrentSection).css("display", "none");
        $('.wrapper').removeClass(CurrentSection)
        $('.wrapper').addClass(getsectionname)
         if (
         newsection === "Home"
          ||
         newsection.length == 0
          ||
         newsection == "Booking"
          ||
         newsection == "Services"
          ||
         newsection == "Settings"
         ) {
             if (dimensions.width > 550) {
                 $('.wideportal').css("display", "block")
             } else {
                 $('.wideportal').css("display", "none")
             }
             newsectionobj.css("display", "flex");
             console.log("#%#$%##$%#% Change section to [" + newsection + "]")
         } else {
             $('.wideportal').css("display", "none")
            newsectionobj.css("display", "block");
            console.log(">>>>>>>>>>>>> Change section to [" + newsection + "]")
         }
         CurrentSection = getsectionname()
         if (newsection === "Booking") {
            console.log("testCookie for Booking.")
            testCookie((token)=> {
                function testThisToken() {
                    if (token == null) {
                        return false
                    } else
                    if (token.length > 0) {
                        return true
                    } else {
                        return false
                    }
                }
                if (testThisToken() == false) {
                    console.log("$$$ Need a valid token.")
                    window.setTimeout(()=> {
                        console.log("Show Login %%%%%%%%%%%%")
                        LoginFlag = true
                        getLoginWindow('tokenneeded')
                    }, 2000)
                } else {
                    console.log("token is [" + token + "]")
                    $('#login').css("display", "none")
                }
            })
        } else
        if (newsection === "Settings") {
            console.log("Settings")
            getLoginWindow('showstatus')
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
    function getElementLocation(selector) {
         const element = document.getElementById(removeLeadingChar(selector, "#"));

         // Get its location relative to the document
         const location = element.getBoundingClientRect();

        // Log its coordinates
        console.log(`Top: ${location.top}, Left: ${location.left}`);
    }
    var ServicesArray = function getServicesArray() {
        const elements = document.querySelectorAll('.neo-service');
        const idArray = Array.from(elements).map(element => element.id);
        return idArray
    }
    var ServiceIndex = 1

      function welcomeFunction(AppMan) {
          console.log('page is loaded icons');
          getElementLocation('#sidebar')
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

          const nomenuflag = AppMan.getQueryValue('nomenuflag')
          if (nomenuflag != null) {
            $('#sidebar').css('display', 'none')
            $('#login').css('display', 'none')
          }

        const initduration = 2000
        const initinterval = 1000
        const defaultdelay = 5000

        function smoothScrollWithInterval(duration, interval, lasttop) {
          var start = window.pageYOffset;
          var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

          var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
          var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
          var destinationOffset = documentHeight - windowHeight;
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          var intervalOffset = Math.floor(viewportHeight);
          var destinationOffsetToScroll = Math.round(documentHeight < windowHeight ? 0 : destinationOffset);
          function scroll() {
            if (!timeoutflag) {
                return
            }
            var currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
            var time = Math.min(1, ((currentTime - startTime) / duration));
            var easedTime = time;

            // Apply easing functions if desired
            // Example: easedTime = easeInOutCubic(time);

            var scrollToOffset = Math.ceil(easedTime * destinationOffsetToScroll + start);
            window.scrollTo(0, scrollToOffset);

            const windowheight = getWindowDimensions().height
            const maxScrollValue = document.documentElement.scrollHeight - windowheight
            const maxScrollTop = $(window).scrollTop()
            const currentTop = lasttop - windowheight
            //console.log("Current=[" + currentTop + " NextTop=[" + lasttop + " Top=[" + maxScrollTop + "] Max=[" + maxScrollValue + "]")
            if (window.pageYOffset >= destinationOffsetToScroll) {
              console.log("done auto scrolling")
              console.log("Get next section.")
              function switchToStart_A() {
                  console.log("SWITCH")
                  $(window).scrollTop(0)
                  smoothScrollWithInterval(initduration, initinterval, 0)
              }
              function switchToStart() {
                  console.log("SWITCH")
                  $(window).scrollTop(0)
                  try {
                      var messageobj = {
                         operation: 'autoscrollswitch',
                      }
                      function sendMessage(message) {
                          window.parent.postMessage(message, "*");
                          console.log("message posted [" + message + "]")
                      }
                      sendMessage(JSON.stringify(messageobj))
                  } catch (e) {
                      console.log(e.toString())
                  }
              }
             window.clearTimeout(timeoutobj)
             window.setTimeout(switchToStart, defaultdelay)
              return;
            }
            if ( maxScrollTop >= lasttop && (maxScrollValue - maxScrollTop) > 50) {
                const nexttop = lasttop + windowheight
                window.clearTimeout(timeoutobj)
                window.setTimeout(()=> {
                  console.log("TIMEOUT")
                  smoothScrollWithInterval(initduration, initinterval, nexttop)
                }, defaultdelay)
            } else
            if (window.pageYOffset % intervalOffset < 1) {
                  timeoutobj = window.setTimeout(scroll, interval);
                } else {
                  requestAnimationFrame(scroll);
                }
            }
          scroll();
        }
        if (nomenuflag != null) {
            smoothScrollWithInterval(initduration, initinterval, 0)
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

function neoOnloadLocal() {
        console.log("neoOnloadLocal()")
        $('#login').css("display", "none")
        let AppMan = ApplicationManager((event, flag) => {
          const services = ServicesArray()
          function getJSONMsg() {
            try{
                return JSON.parse(event.data)
            } catch (e) {
            }
            return {}
          }
          const jsonobj = getJSONMsg()
          if (typeof(jsonobj.operation) === "undefined") {
            if (typeof(flag) === "undefined") {
                if (!LoginFlag) {
                    $('#login').css("display", "none")
                }
                console.log("event.data=[" + event.data + "]")
            } else
            if (flag == true) {
                $('#login').css("display", "block")
                console.log("event.data=[" + event.data + "]")
            }
          } else
          if (jsonobj.operation === "autoscrollswitch") {
                $('#rightpanel').attr('data', "side.html#" + services[ServiceIndex] + "?nomenuflag=true")
                if (ServiceIndex >= (services.length-1)) {
                    ServiceIndex = 0
                } else {
                    ServiceIndex++
                }
          } else
          if (jsonobj.operation === "showtoken") {
              console.log("xshowtoken=[" + JSON.stringify(jsonobj.token) + "]")
              console.log("token value=[" + $('#Token').text() + "]")
              $('#Token').text(JSON.stringify(jsonobj.token))
          }
        })
        AppMan.
        verify(
        () => {
            thishref = $('#login').attr('data')
            console.log("Xthishref=[" + thishref + "]")
            return thishref
        },
        (newquery) => {
            $('#login').attr('data', newquery)
        })

//        testCookie((token)=> {
//            if (token == null) {
//                $('#login').css("display", "block")
//            } else {
//            }
//        })

        return AppMan;
}
