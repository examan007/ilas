var CustomManager = function() {
    var console = {
        log: function(msg) {},
    }
    var SidebarState = "Minimized"
    var LoginFlag = false
    function setCurrentToken(token) {
        const button = document.getElementById("signbutton")
        if (typeof(token.email) === 'undefined') {
        } else {
            button.textContent = "Sign Off"
            console.log("token: " + JSON.stringify(token))
            const templateclass = 'template-settings-label'
            const templates = document.querySelectorAll("." + templateclass)
            templates.forEach((template)=> {
                const parent = template.parent
                while(template.nextElementSibling) {
                    parent.removeChild(template.nextElementSibling)
                }
                for (const key in token) {
                  if (token.hasOwnProperty(key)) {
                    const name = key
                    const value = token[key]
                    console.log("token: name: " + name + " value: " + value)
                    const cloneSection = template.cloneNode(true)
                    cloneSection.setAttribute("style", "display: block;")
                    cloneSection.classList.remove(templateclass)
                    cloneSection.innerHTML = eval('`' + cloneSection.innerHTML + '`')
                    template.parentNode.appendChild(cloneSection)
                    template.setAttribute("style", "display: none;")
                  }
                }
            })
        }
    }
    function initializeSignButton(AppMan) {
        const button = document.getElementById("signbutton")
        button.addEventListener("click", ()=> {
            const text = button.textContent
            if (text === "Sign Off") {
//                AppMan.setCookie(JSON.stringify({
//                    token: ""
//                }))
                $.cookie('neotoken', "", { expires: 365 })
                sendToChildWindow('login', {
                    operation: "signoff"
                })
                window.setTimeout(()=> {
                   location.reload()
                }, 500)
            } else {
                //button.textContent = "Sign Off"
                signOn()
            }
        })
    }
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
        return
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
   var SidebarTimeoutObj = null
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
      if (SidebarTimeoutObj) {
          clearTimeout(SidebarTimeoutObj)
          SidebarTimeoutObj = null
      }
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
        SidebarTimeoutObj = setTimeout(toggleSidebarAlone, 500)
        SidebarState = NewSidebarState
      }
      ret = ! $('.sidebar').hasClass('close')

        return ret
    }

    var lastwidth = 0
    var lastheight = 0
      function resizeScreen() {
        const dimensions = getWindowDimensions()
        console.log("resize with new width =[" + dimensions.width + "]")
        $('.wrapper').css("width", "" + dimensions.width + "px")
        if (dimensions.width > 550) {
            $('.wideportal').css("width", "" + (dimensions.width - 550) + "px")
            if (lastwidth < 550) {
                location.reload()
            }
       } else {
            if (lastwidth > 550) {
                location.reload()
            }
       }
       lastwidth = dimensions.width
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
    const DefaultSection = "Services"
    var CurrentSection = DefaultSection
    var BookingReady = false
    const StartupBookingQueue = []
    var LoginReady = false
    const StartupLoginQueue = []
    function sendToChildWindow(identifier, messageobj) {
        console.log("sendToChildWindow: " + JSON.stringify(messageobj))
        if (identifier === "calendar" && BookingReady === false) {
            StartupBookingQueue.push(messageobj)
            return
        }
        if (identifier === "login" && LoginReady === false) {
            StartupLoginQueue.push(messageobj)
            return
        }
        var objectEl = document.getElementById(identifier);
        if (objectEl.contentWindow != null) {
          function sendMessage(message) {
              objectEl.contentWindow.postMessage(message, "*");
              console.log("To " + identifier + " window message posted [" + message + "]")
          }
          sendMessage(JSON.stringify(messageobj))
         } else {
            console.log("Cannot get window object. [" + identifier + "]")
            window.setTimeout(()=> {
                sendToChildWindow(identifier, messageobj)
            }, 1000)
         }
    }
    function getLoginWindow(operation) {
        const messageobj = {
            operation: operation,
        }
        $('#login').css("display", "block")
        $('#login').on('click', function() {
              console.log('login was clicked!')
              toggleSidebar(false)
        })
        sendToChildWindow('login', messageobj)
    }
    function getServiceValue(name, defval) {
         const value = AppMan.getQueryValue(name)
         if (value == null) {
            if (typeof(defval) === 'undefined') {
                return ""
            } else {
                return defval
            }
         } else {
            return value
         }
    }
    const FilterState = {
        current: null
    }

    function getServicesObj() {
        if (FilterState.current !== null) {
            return FilterState.current
        }
        const ret = {
            services: "",
            classname: ""
        }
        try {
            ret.services = getServiceValue("services", ret.services).replace(/_/g, ' '),
            ret.classname = getServiceValue("classname", ret.classname).replace(/_/g, ' ')
        } catch (e) {
            console.log(e.stack.toString())
        }
        return ret
    }
    function sendFilterMessage(inmessage) {
        const message = getServicesObj()
        if (message.classname !== inmessage.classname) {
            message.operation = "filteravailable"
            sendToChildWindow('calendar', message)
        }
    }
    function createControlBlocks() {
        console.log("create control blocks.")
        const bookelement = document.getElementById("Booking")
        const parent = bookelement.querySelectorAll('.control-container')[0]
        do {
            const blocklist = bookelement.querySelectorAll('.control-block')
            if (blocklist.length > 0) {
                parent.removeChild(blocklist[0])
            } else {
                break
            }
        } while (true)
        console.log("creating new control blocks")
        const template = bookelement.querySelectorAll('.template-control-block')[0]
        function createblock(name) {
            const block =  template.cloneNode(true)
            block.innerHTML = eval('`' + block.innerHTML + '`')
            block.classList.remove('template-control-block')
            block.classList.add('control-block')
            parent.appendChild(block)
        }
        const message = getServicesObj()
        createblock(message.classname)
        //createblock(message.services)
        message.operation = "filteravailable"
        sendToChildWindow('calendar', message)
    }
    var Gflag = true;
    function createFilterSelect(inflag) {
        function getFlag() {
            if (typeof(inflag) === 'undefined') {
                return false
            }
            return inflag
        }
        const flag = getFlag()
        const select = document.querySelector("#filter-state div")
        const options = select.querySelectorAll("div")
        //const selectedIndex = select.selectedIndex
        //const selectedOption = select.options[selectedIndex]BookingReady
        const message = getServicesObj()
        console.log("create " + flag + " : " + select.outerHTML + "\n" + JSON.stringify(message))
        message.operation = "filteravailable"
        if (flag == false) {
//            sendToChildWindow('calendar', message)
        }
        function getBackgroundColor(classname, callback) {
            if (classname === "Phone Consult") {
                callback("rgba(225, 227, 102, 0.5)")
            } else
            if (ServicesData) {
                function getMatch(index) {
                    if (index < ServicesData.tabs.length) {
                        //console.log("index: " + index + " " + JSON.stringify(ServicesData.tabs[index]))
                        if (ServicesData.tabs[index].name === classname) {
                            callback(ServicesData.tabs[index].color)
                        } else {
                            getMatch(index + 1)
                        }
                    }
                }
                getMatch(0)
            }
        }
        function testOption(index, flag, selected) {
            if (index < options.length) {
                const option = options[index]
                const test = option.textContent
                console.log("test=" + test)
                if ( flag === true) {
                    option.classList.remove("control-block-small")
                    option.classList.add("control-block-large")
                    option.setAttribute("style", "display: block;")
                    getBackgroundColor(test, (color)=> {
                        option.setAttribute("style", "display: block; background-color: " + color + ";")
                    })
                    document.getElementById("dropDown").setAttribute("style", "display: none")
                } else
                if (test === message.classname) {
                    option.classList.remove("control-block-large")
                    option.classList.add("control-block-small")
                    option.setAttribute("style", "display: block;")
                    document.getElementById("dropDown").setAttribute("style", "display: block")
                    return testOption(index + 1, flag, option)
                } else {
                    option.setAttribute("style", "display: none;")
                    option.classList.remove("control-block-large")
                    option.classList.add("control-block-small")
                }
                return testOption(index + 1, flag, selected)
            }
            return selected
        }
        if (flag) {
            select.classList.add("control-block-border")
            //initializeUnselect()
        } else {
            select.classList.remove("control-block-border")
        }
        const selected = testOption(0, flag, null)
        if (selected !== null) {
            const parent = selected.parentNode
            parent.removeChild(selected);
            parent.insertBefore(selected, parent.firstChild);
        }
        Gflag = flag ? false : true
        return Gflag
    }
    function showFlags(label, text) {
        console.log("click mo " + label + " gflag=" + Gflag.toString() + " swallow=" + SwallowClick.toString() + " " + text)
    }
    var SwallowClick = false
    var SwallowMouseover = false
     function initializeUnselect(selector) {
        document.querySelectorAll(selector).
          forEach((optionElement)=> {
            optionElement.addEventListener('mouseout', function() {
                showFlags("mouseout", this.textContent)
                if (Gflag) {
                    return
                }
                SwallowMouseover = true
                window.setTimeout(()=> {
                    SwallowMouseover = false
                }, 100)
                const message = getServicesObj()
                console.log(`You selected: ` + JSON.stringify(message))
                createFilterSelect(false)
                showFlags("mouseout", this.textContent)
            })
            optionElement.addEventListener('mouseover', function() {
                showFlags("mouseover", this.textContent)
                if (!Gflag) {
                    return
                }
                if (SwallowMouseover) {
                    SwallowMouseover = false
                } else {
                    SwallowClick = true
                    window.setTimeout(()=> {
                        SwallowClick = false
                    }, 100)
                }
                const message = getServicesObj()
                console.log(`You selected: ` + JSON.stringify(message))
                createFilterSelect(true)
                showFlags("mouseover", this.textContent)
            })
            optionElement.addEventListener('click', function() {
                showFlags("click", this.textContent)
                if (SwallowClick) {
                    SwallowClick = false
                    return
                } else
                if (Gflag) {
                    createFilterSelect(true)
                    return
                } else
                if (this.textContent.length <= 0) {
                    return
                }
                const testmessage = getServicesObj()
                const newclassname = this.textContent
                if (testmessage.classname === newclassname) {
                    console.log("No change")
                } else {
                    testmessage.classname = newclassname
                    FilterState.last = FilterState.current
                    FilterState.current = testmessage
                    const message = getServicesObj()
                    message.services = ""
                    message.operation = "filteravailable"
                    sendToChildWindow('calendar', message)
                    var updatehrefmessage = {
                        operation: "seturistate",
                        newhashcode: "Booking",
                        newhref: "?" + AppMan.replaceQueryValue("classname",
                         newclassname.replace(/ /g,"_")
                         )
                    }
                    window.postMessage(JSON.stringify(updatehrefmessage), "*")
                }
                createFilterSelect(false)
                showFlags("click", this.textContent)
            })
        })
    }
    initializeUnselect("#filter-state div div")
    initializeUnselect("#dropDown i")
    function signOn() {
        $('#login').css('display','block')
        window.setTimeout(()=> {
            console.log("Do NOT Show Login %%%%%%%%%%%%")
            LoginFlag = true
            getLoginWindow('tokenneeded')
        }, 1000)
    }
    function changeSection(newsection) {
        function testDomobj(elementid) {
            return $('#' + elementid)
        }
        function getsectionobj() {
            try {
                if (newsection.length > 0) {
                    return testDomobj(newsection)
                } else {
                    return testDomobj(DefaultSection)
                }
            } catch (e) {
                console.log(e.toString())
            }
            return testDomobj(DefaultSection)
        }
        function getsectionname() {
            if (newsection.length > 0) {
                return newsection
            } else {
                return DefaultSection
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
         newsection === "Booking"
          ||
         newsection === "Services"
          ||
         newsection === "Settings"
         ) {
             if (dimensions.width > 550) {
                 $('.wideportal').css("display", "block")
             } else {
                 $('.wideportal').css("display", "none")
             }
             newsectionobj.css("display", "flex");
             console.log("#%#$%##$%#% Change section to [" + newsection + "]")
            if (newsection === "Booking") {
             $('.banner').css('display', 'none')
            } else {
             $('.banner').css('display', 'block')
            }
         } else {
            const nomenuflag = AppMan.getQueryValue('nomenuflag')
            if (nomenuflag != null) {
                 $('.banner').css('display', 'none')
            } else {
                 $('.banner').css('display', 'block')
            }
             $('.wideportal').css("display", "none")
            newsectionobj.css("display", "block");
            console.log(">>>>>>>>>>>>> Change section to [" + newsection + "]")
         }
         CurrentSection = getsectionname()
         if (newsection === "Booking" || newsection === "Settings") {
            console.log("testCookie for Booking.")
            createFilterSelect(false)
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
                    if (AppMan.getQueryValue("classname") === "My_Appointments") {
                        signOn()
                    }
                    var message = {
                      operation: 'readappointments',
                      authentication: false
                    }
                    sendToChildWindow('login', message)
                } else {
                    console.log("token is [" + token + "]")
                    $('#login').css("display", "none")
                    var message = {
                      operation: 'readappointments',
                      authentication: true
                    }
                    sendToChildWindow('login', message)
                }
            })
            window.setTimeout(()=> {
                Gflag = createFilterSelect(false)
                sendFilterMessage({
                    services: "",
                    classname: ""
                })
                }, 1000)
        } else
        if (newsection === "Settings") {
            console.log("Settings")
            //getLoginWindow('showstatus')
        }
        if (newsection === "Home" || newsection.length == 0 || newsection === "Services" || newsection === "Settings") {
            $('#scrollButton').css('display', 'block')
        } else {
            $('#scrollButton').css('display', 'none')
        }
        newsectionobj.on('click', function() {
          console.log('close sidebar!')
          toggleSidebar(false)
        })
//        resizeScreen();
//        $('.sidebar').addClass('close')
//        $('section').css("margin-left", "" + 78 + "px")
         //window.setTimeout(createControlBlocks, 1000)
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
   function getServicesArray(classname) {
        try {
            const elements = document.querySelectorAll(classname);
            return Array.from(elements).map(element => element.id);
        } catch (e) {
            console.log(e.stack.toString())
        }
        return []
    }
    var ServiceIndex = 2
    var ServicesArray = getServicesArray('.neo-service')
    var SectionArray = getServicesArray('.neo-home')
    function getNextSection() {
        function testSection(index) {
            function getSection (index) {
                const section = SectionArray[index]
                if (typeof(section) === 'undefined') {
                    return ''
                } else {
                    return section
                }
            }
            const section = getSection(index)
            if (section.length === 0) {
                return section;
            }
            if (section === CurrentSection) {
                return getSection(index+1)
            }
            const retsec = testSection(index + 1)
            console.log("testSection: " + retsec)
            return retsec
        }
        const newsection = testSection(0)
        if (newsection.length > 0) {
            return newsection
        } else {
            return SectionArray[0]
        }
    }
    var EntrantCount = 0
      function welcomeFunction(AppMan) {
          EntrantCount = EntrantCount + 1
          console.log("EntrantCount=" + EntrantCount)
          if (EntrantCount != 1) {
            return
          }
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
              changeSection(DefaultSection)
          } else
          if (hashValue.length <= 0) {
              changeSection(DefaultSection)
          } else {
              console.log("hashValue=[" + hashValue + "]")
              changeSection(removeLeadingChar(hashValue, "#"))
          }
          SidebarTimeoutObj = setTimeout(toggleSidebarAlone, 0)

          const nomenuflag = AppMan.getQueryValue('nomenuflag')
          if (nomenuflag != null) {
            $('#sidebar').css('display', 'none')
            $('#login').css('display', 'none')
            $('#scrollButton').css('display', 'none')
          }

        function registerForEach(objectids, callback) {
            function register(index) {
                const objid = objectids[index]
                if (typeof(objid) === 'undefined') {
                    return
                }
                callback(objid)
                register(index + 1)
            }
            register(0)
        }
        registerForEach(['login', 'calendar'], function (obj) {
            const selector = '#' + obj
            $(selector).on('click', function() {
              console.log('registered on click close sidebar')
              toggleSidebar(false)
            })
        })
        const elements = document.querySelectorAll('.triangle');
        elements.forEach(element => {
          element.addEventListener('click', (event) => {
            window.clearTimeout(timeoutobj)
            timeoutflag = false
            timeoutobj = null
            const container = document.querySelectorAll('.container')[0]
            container.setAttribute("style", "display: none;")
            console.log(`Clicked on ${event.target.classList}`);
          });
        });
        //const nomenuflag = AppMan.getQueryValue('nomenuflag')
        if (nomenuflag == null) {
            const container = document.querySelectorAll('.container')[0]
            container.setAttribute("style", "display: none;")
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
                  //$(window).scrollTop(0)
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
             timeoutobj = window.setTimeout(switchToStart, defaultdelay)
              return;
            }
            if ( maxScrollTop >= lasttop && (maxScrollValue - maxScrollTop) > 50) {
                const nexttop = lasttop + windowheight
                window.clearTimeout(timeoutobj)
                timeoutobj = window.setTimeout(()=> {
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

    let AppMan = null
    var count = 0
    function showLoadStack() {
        try {
            undefinedvar.test
        } catch (e) {
            console.log("neoOnload " + e.stack.toString())
        }
    }
    function neoOnloadLocal() {
           showLoadStack()
                count = count + 1
                if (count > 1) {
                    console.log("neoOnloadLocal(); reentered")
                    return
                }

            console.log("neoOnloadLocal()")
            AppMan = ApplicationManager((event, flag) => {
              const services = getServicesArray('.neo-service')
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
                if (jsonobj.operation === 'closesidebar') {
                    toggleSidebar(false)
                    createFilterSelect(false)
                } else
                if (jsonobj.operation === 'showappointmentrequest') {
                    console.log("appointment request")
                    console.log("Request object", JSON.stringify($('#login').children()))
                    function getSectionName(callback) {
                        AppMan.testCookie((token)=> {
                            if (typeof(token) === 'undefined') {
                                callback('Appoint')
                            } else
                            if (token == null) {
                                callback('Appoint')
                            } else
                            if (token.length > 16) {
                                callback('Request')
                            } else {
                                callback('Appoint')
                            }
                        })
                    }
                    getSectionName((sectionname) => {
                        var message = {
                          operation: 'showsection',
                          sectionname: sectionname,
                          datetime: jsonobj.datetime,
                          message: jsonobj,
                          services: jsonobj.usermessage + " " + getServicesObj().services,
                          classname: jsonobj.title
                        }
                        sendToChildWindow('login', message)
                        $('#login').css("display", "block")
                    })
                } else
                if (jsonobj.operation === 'changeappointmentrequest') {
                    if (jsonobj.event.title.indexOf("Booked") < 0) {
                        console.log("appointment change")
                        console.log("Request object", JSON.stringify($('#login').children()))
                        var message = {
                          operation: 'showsection',
                          sectionname: 'Change',
                          datetime: jsonobj.event.start,
                          usermessage: jsonobj.event.title,
                          message: jsonobj
                        }
                        sendToChildWindow('login', message)
                        $('#login').css("display", "block")
                    }
                } else
                if (jsonobj.operation === 'bookpageloaded') {
                    console.log("neoOnload Book page loaded.")
                    BookingReady = true
                    while (StartupBookingQueue.length > 0) {
                        sendToChildWindow('calendar', StartupBookingQueue.shift())
                    }
                } else
                if (jsonobj.operation === 'loginpageloaded') {
                    console.log("Login page loaded.")
                    welcomeFunction(AppMan)
                    $('#login').css('display','none')
                    LoginReady = true
                    while (StartupLoginQueue.length > 0) {
                        sendToChildWindow('login', StartupLoginQueue.shift())
                    }
                } else
              if (jsonobj.operation === "exitlogin") {
                    $('#login').css("display", "none")
              } else
              if (jsonobj.operation === "showlogin") {
                    if (AppMan.getQueryValue('nomenuflag') !== "true") {
                       $('#login').css("display", "block")
                    }
              } else
              if (jsonobj.operation === "autoscrollswitch") {
                    $('#rightpanel').attr('data', "side.html#" + services[ServiceIndex] + "?nomenuflag=true")
                    if (ServiceIndex >= (services.length-1)) {
                        ServiceIndex = 1
                    } else {
                        ServiceIndex++
                    }
              } else
              if (jsonobj.operation === "showtoken") {
                  console.log("xshowtoken=[" + JSON.stringify(jsonobj.token) + "]")
                  console.log("token value=[" + $('#Token').text() + "]")
                  $('#Token').text(JSON.stringify(jsonobj.token))
              } else
              if (jsonobj.operation === "createevent") {
                sendToChildWindow('calendar', jsonobj)
                changeSection("Booking")
              } else
              if (jsonobj.operation === "readappointments") {
                sendToChildWindow('calendar', jsonobj)
                console.log("readappointments: " + JSON.stringify(jsonobj))
                try {
                    const token = jsonobj.data.token
                    console.log("readappointments: ", JSON.stringify(token))
                    setCurrentToken(token)
                } catch (e) {
                    console.log("readappointments: " + toString())
                }
              } else
              if (jsonobj.operation === "readservices") {
                processServicesData(jsonobj.data)
              } else
              if (jsonobj.operation === "salonhours") {
                sendToChildWindow('login', jsonobj)
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

    function createPamplets () {
        function buildElements(identifiers, divname) {
            neoSections = document.getElementsByClassName(divname)
            // Iterate over each neo-section element
            Array.from(neoSections).forEach(function(neoSection) {
              // Find the pamphlet element within the neo-section
              var pamphletDiv = neoSection.getElementsByClassName('template-pamphlet')[0];
              function getIdentifiers() {
                if (neoSection.getAttribute("id") === "Hair_Removal") {
                    return ['anytone-M', 'anytone-N', 'anytone-O', 'anytone-P', 'anytone-Q', 'anytone-R', 'M', 'N', 'O', 'P', 'Q', 'R']
                } else {
                    return identifiers
                }
              }
              // Iterate over the identifiers and update the data source attribute
              var done = false
              getIdentifiers().forEach(function(identifier) {
                if (done) {
                    return
                } else
                try {
                    // Clone the pamphlet element
                    var clonePamphlet = pamphletDiv.cloneNode(true);

                    // Find the image element within the cloned pamphlet
                    var image = clonePamphlet.getElementsByTagName('img')[0];

                    // Set the data source attribute based on the identifier
                    const imagename = image.getAttribute('data-src').replace('{identifier}', identifier)
                    image.setAttribute('data-src', imagename)

                    // Append the cloned image element to the cloned pamphlet div
                    neoSection.appendChild(clonePamphlet);
                    clonePamphlet.classList.remove('template-pamphlet');
                    clonePamphlet.classList.add('active-pamphlet');
                    console.log("imagename=" + imagename)
                    if (imagename === "docs/Eliminate-Spider-Veins-N.png" ) {
                        console.log("done imagename")
                        done = true;
                    }
                } catch (e) {
                    console.log("createPamplet() " + e.toString())
                }
              });
            });
        }
        buildElements(['M', 'N', 'O', 'P', 'Q', 'R'], 'neo-repeat')
        buildElements(['A', 'B', 'C'], 'neo-altrepeat')
    }
    function loadImagesLazyily() {
        // Get all the images with the 'data-src' attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        console.log("loading images")

        // Create a new Intersection Observer instance
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              function adjustAllSiblngs(entry) {
                  function getSiblings(elem) {
                     console.log("entry=[" + elem.getAttribute('class') + "]")
                     return (elem.parentNode.parentNode.getElementsByClassName('pageimage'))
                  }
                  function testParent(elem) {
                    try {
                        return elem.parentNode.classList.contains('active-pamphlet')
                    } catch (e) {
                        console.log(e.toString())
                    }
                    return false
                  }
                const siblings = getSiblings(entry.target)
                console.log("loading siblings [" + siblings.length + "]")
                Array.from(siblings).forEach(function (sibling) {
                    if (testParent(sibling)) {
                      sibling.src = sibling.dataset.src;
                    }
                    observer.unobserve(sibling);
                });
              }
              try {
                  console.log("Setting img src")
                  entry.target.src = entry.target.dataset.src
                  adjustAllSiblngs(entry)
              } catch (e) {
                console.log("adjust " + e.toString())
              }
            }
          });
        });

        // Start observing each lazy image
        lazyImages.forEach((lazyImage) => {
          lazyImage.src = 'images/logo-white-large.jpg';
          imageObserver.observe(lazyImage);
        });
    }
    function initializeMenu() {
        let arrow = document.querySelectorAll(".arrow");
        for (var i = 0; i < arrow.length; i++) {
          arrow[i].addEventListener("click", (e) => {
            let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
            arrowParent.classList.toggle("showMenu");
          });
        }
        let sidebar = document.querySelector(".sidebar");
        let sidebarBtn = document.querySelector(".bx-menu");
        let menuspace = document.querySelector("#menu-space");

        console.log(sidebarBtn);
    //    $('.sidebar').toggleClass('close');

        /* sidebarBtn.addEventListener("click", () => {
          sidebar.classList.toggle("close");
        }); */
    }

    $(document).ready(function() {
      $('#scrollButton').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
      });
    });

    function runFadeInOut(flag, selector) {
        window.setTimeout(()=> {
            function toggle() {
                if (flag) {
                    document.querySelector(selector).classList.add('show');
                } else {
                    document.querySelector(selector).classList.remove('show');
                }
                runFadeInOut(!flag, selector)
            }
            toggle()
        }, 2000)
    }
    runFadeInOut(true, '#scrollButton')
    runFadeInOut(true, '#dropDown')

    function switchToNextSection() {
        const newsection = getNextSection()
        changeSection(newsection)
        var message = {
            operation: "seturistate",
            newhashcode: newsection,
        }
        window.postMessage(JSON.stringify(message), "*")
    }

    function registerForEvents() {
        console.log("Adding event listener")
        $('#scrollButton').on("click", ()=> {
            scrollToNextSection(1)
        })
    }

    var blockflag = false
    function scrollToNextSection(direction) {
        console.log(direction > 0 ? "up swipe" : "down swipe")
        const NextSection = getNextSection()
        console.log("next section: [" + NextSection + "]")
        if (NextSection === CurrentSection) {
            return
        }
        if (!SectionArray.includes(CurrentSection)) {
            return
        }
        if (blockflag) {
            return
        }
        blockflag = true
        const current = document.getElementById(CurrentSection);
        const nextsec = document.getElementById(NextSection);
        function clearClasses() {
            const objs=[current, nextsec]
            function remove(index) {
                const obj = objs[index]
                if (typeof(obj) !== 'undefined') {
                    const classes = [
                        'section-quick',
                        'section-ease',
                        'slide-in',
                        'slide-out-top',
                        'slide-out-bottom'
                        ]
                    function removeClass(index) {
                        const classname = classes[index]
                        if (typeof(classname) !== 'undefined') {
                            obj.classList.remove(classname)
                            removeClass(index + 1)
                        }
                    }
                    removeClass(0)
                }
                remove(0)
            }
        }
        clearClasses()
        current.classList.add('section-quick')
        nextsec.classList.add('section-quick')
        current.classList.add('slide-in')
        if (direction > 0) {
            nextsec.classList.add('slide-out-bottom')
        } else {
            nextsec.classList.add('slide-out-top')
        }
        $('#' + NextSection).css("visibility", "hidden")
        $('#' + NextSection).css("display", "flex")
        window.setTimeout(()=> {
            $('#' + NextSection).css("visibility", "visible")
            nextsec.classList.remove('section-quick')
            current.classList.remove('section-quick')
            nextsec.classList.add('section-ease')
            current.classList.add('section-ease')
            if (direction > 0) {
                nextsec.classList.remove('slide-out-bottom')
            } else {
                nextsec.classList.remove('slide-out-top')
            }
            current.classList.remove('slide-in')
            if (direction > 0) {
                current.classList.add('slide-out-top')
            } else {
                current.classList.add('slide-out-bottom')
            }
            window.setTimeout(()=> {
                nextsec.classList.add('slide-in')

                console.log("make next section visible.")
                window.setTimeout(()=> {
                    $('#' + CurrentSection).css("display", "none")
                    if (direction > 0) {
                        current.classList.remove('slide-out-top')
                    } else {
                        current.classList.remove('slide-out-bottom')
                    }
                    nextsec.classList.remove('slide-in')
                    nextsec.classList.remove('section-ease')
                    current.classList.remove('section-ease')
                    window.setTimeout(()=> {
                         blockflag = false
                        switchToNextSection()
                    }, 1)
                }, 1)
            }, 1000)
        },100)
    }

    function initSwipeScroll() {
        // Variables to store initial and final touch positions
        let startY;
        let endY;

        // Threshold value to determine if a swipe is valid
        const swipeThreshold = 75
        ;

        // Event listener for touchstart (or mousedown) event
        document.addEventListener('touchstart', touchStartHandler, false);

        function touchStartHandler(event) {
          // Store initial touch position
          startY = event.touches[0].clientY;
        }

        // Event listener for touchend (or mouseup) event
        document.addEventListener('touchend', touchEndHandler, false);

        function touchEndHandler(event) {
          // Store final touch position
          endY = event.changedTouches[0].clientY;

          // Calculate the difference between initial and final touch positions
          const diffY = startY - endY;

          // Check if the swipe distance is greater than the threshold
          if (Math.abs(diffY) > swipeThreshold) {
            // Check if it's an upward swipe
            startY = 0
            endY = 0
            if (diffY > 0) {
              // Scroll to the next section
              scrollToNextSection(1);
            } else {
              scrollToNextSection(-1);
            }
          }
        }
    }

    function getServiceNames() {
        const names = []
        console.log("initializeServiceLinks()")
        const parentArray = document.querySelectorAll('.sub-menu')
        parentArray.forEach((parentElement)=> {
            //console.log("sub-menu")
            const childElements = parentElement.querySelectorAll('a');
            var flag = false
            childElements.forEach((element)=> {
                function getNameFromAnchor() {
                    try {
                        return  element.getAttribute("href").
                         replace(new RegExp('_', 'g'), ' ').
                         substring(1)
                    } catch (e) {
                        console.log(e.stack.toString())
                        return e.toString()
                    }
                }
                const name = getNameFromAnchor()
                if (name === 'Services') {
                    flag = true
                } else
                if (flag) {
                    console.log("element=[" + name + "]")
                    names.push({
                        keyname: name,
                        imagename: name,
                        nicename: element.childNodes[0].textContent
                    })
                } else {
                    console.log("element=[" + name + "]")
                }
            })
        })
        return names
    }
    function createServiceSections() {
        try {
            const identifiers = getServiceNames()
            const sectiondiv = document.getElementsByClassName('template-section')[0]
            identifiers.forEach(function(identifier) {
                const name = identifier.keyname
                const nicename = identifier.nicename
                const cloneSection = sectiondiv.cloneNode(true);
                function replacetags(element, attrname, tagstr, value) {
                    element.setAttribute(attrname,
                     element.getAttribute(attrname).replace(tagstr, value))
                }
                replacetags(cloneSection,
                    'id', '{section-identifier}', name.replace(new RegExp(' ', 'g'), '_'))
                replacetags(cloneSection.getElementsByTagName('img')[0],
                    'data-src', '{image-identifier}', name.replace(new RegExp(' ', 'g'), '-'))
                replacetags(cloneSection.getElementsByTagName('img')[0],
                    'alt', '{nicename}', name)
                cloneSection.classList.remove('template-section')
                sectiondiv.parentNode.appendChild(cloneSection)
            })
        } catch (e) {
            console.log(e.stack.toString())
        }
    }

    function copyStaticElements() {
        try {
            const copies = document.querySelectorAll('.neo-copy')
            copies.forEach((parent)=> {
                const copyclass = parent.classList[1]
                const original = document.querySelectorAll('.' + copyclass)[0]
                original.childNodes.forEach((child)=> {
                    const cloned = child.cloneNode(true);
                    parent.appendChild(cloned);
                })
                parent.classList.remove('neo-copy');
            })
        } catch (e) {
            console.log(e.stack.toString())
        }
    }

    function initializeAnchorEvents(tabs) {
        var anchors = document.querySelectorAll('#Services-List a');
        var index = 0
        anchors.forEach((anchor)=> {
            var acolour = ""
            const anchorid = anchor.getAttribute("id")
            const serviceid = anchorid.substring(2)
            const classname = anchor.getAttribute("class")
            console.log("anchor=" + anchor)
            anchor.addEventListener('contextmenu', function(event) {
              event.preventDefault(); // Prevent the browser's context menu from appearing
            })
            anchor.addEventListener("click", function(event) {
                console.log("Click: " + serviceid + " href=" + window.location.href)
               if (AppMan.getQueryValue("booking") === "true") {
                    event.preventDefault()
                    changeSection("Booking")
                    const newState = { page: "newpage" }
                    const newTitle = "Book " + anchorid.substring(2)
                    const newUrl = "#Booking?services=" + serviceid + "&classname=" + classname
                    history.pushState(newState, newTitle, newUrl)
                } else
                if (AppMan.getQueryValue("booking") === "false") {
                    event.preventDefault()
                    changeSection(serviceid)
                    const newState = { page: "newpage" }
                    const newTitle = "classname" + ":" + serviceid
                    const newUrl = "#" + serviceid
                    history.pushState(newState, newTitle, newUrl)
                }
            })
            anchor.addEventListener("mouseover", function(event) {
                console.log("Over: " + anchorid )
                acolour = anchor.style.color
                anchor.style.color = "rgba(172,148,232,1)"
            })
            anchor.addEventListener("mouseout", function(event) {
                console.log("Out: " + anchorid)
                anchor.style.color = acolour
            })
            function setLongPress() {
                var longPressTimeout;
                anchor.addEventListener('touchstart', function(event) {
                  longPressTimeout = setTimeout(function() {
                    event.preventDefault(); // Prevent the default long-press behavior
                  }, 1000); // Set the time threshold for a long press (in milliseconds)
                });

                anchor.addEventListener('touchend', function() {
                  clearTimeout(longPressTimeout); // Cancel the timeout if the touch is released before the long-press threshold
                });
            }
            setLongPress()
            index = index + 1
        })
    }

/*
    function registerSectionClick() {
        const sections = document.querySelectorAll('.neo-section')
        sections.forEach((section)=> {
            section.addEventListener('click', function() {
                //toggleSidebar(false)
                createFilterSelect(false)
            })
        })
    }
*/
    //registerSectionClick()
    var TabMgr = null
    var ServicesData = null

    function generateError() {
      try {
        undefinedVariable.show;
      } catch (error) {
        console.log(error.stack);
      }
    }

    function createServiceOptions(tab, options) {
        try {
            const id = tab.id
            const classname = tab.name.replace(/ /g, '_')
            const sectiondiv = document.getElementById("Services-List")
            const templatetab = sectiondiv.getElementsByClassName('template-tab')[0]
            const clonecontent = templatetab.cloneNode(true);
            const tabname = clonecontent.getAttribute('id').replace('${tabname}', id)
            clonecontent.classList.remove("template-tab")
            clonecontent.setAttribute('id', tabname)
            templatetab.parentNode.appendChild(clonecontent)
            const template = clonecontent.getElementsByClassName('template-brochure')[0]
            options.forEach(function(obj) {
                console.log("Tab: " + id + " Service option: " + JSON.stringify(obj))
                const cloneSection = template.cloneNode(true);
                const nicename = obj.name
                const identifier = obj.id
                const tabnumber = parseInt(tabname.match(/\d+/)[0]);
                function getHrefUrl() {
                    if (id === "tab2") {
                        return obj.id
                    } else {
                        return ""
                    }
                }
                const hrefurl = getHrefUrl()
                cloneSection.classList.remove("template-brochure")
                cloneSection.innerHTML = eval('`' + cloneSection.innerHTML + '`')
                template.parentNode.appendChild(cloneSection)
            })
            function getTabNumber() {
                const tabnumber = Number(AppMan.getQueryValue('tab'))
                console.log("tabnumber=" + tabnumber)
                if (tabnumber === 0) {
                    return 2
                } else {
                    return tabnumber
                }
            }
            TabMgr.defaultTab(getTabNumber(), AppMan)
        } catch (e) {
            console.log(e.stack.toString())
        }
    }
    function processServicesData(data) {
        if (JSON.stringify(data) === "null") {
            generateError();
        } else {
            ServicesData = data
            console.log("new data = " + JSON.stringify(data))
            createServiceOptions(data.tabs[0], data.tabs[0].services)
            createServiceOptions(data.tabs[1], data.tabs[1].services)
            createServiceOptions(data.tabs[2], data.tabs[2].services)
            initializeAnchorEvents(data.tabs)
        }
    }
    function getServicesTabs() {
        var message = {
            operation: 'readservices',
            authentication: false,
            resource: getResource()
        }
        function getResource() {
            const resource = "data/services.json"
            try {
                const serverandpath = window.location.href.split("?")[0]
                const lastslash = serverandpath.lastIndexOf('/')
                const fullpath = serverandpath.substring(0, lastslash)
                return fullpath + "/" + resource
            } catch (e) {
                console.log(e.toString())
                return "" + resource
            }
        }
        console.log("readservices: ", JSON.stringify(message))
        sendToChildWindow('login', message)
    }

    return {
        neoOnloadLocal: function () {
            copyStaticElements()
            createServiceSections()
            createPamplets()
            loadImagesLazyily()
            $('#login').css("display", "block")
            $('#calendar').css("display", "block")
            let appman = neoOnloadLocal()
            TabMgr = TabManager(appman)
            neobookOnLoad()
            registerForEvents()
            neobookOnLoad()
            initializeMenu()
            initSwipeScroll()
            getServicesTabs()
            initializeSignButton(appman)
            console.log("Done load.")
        }
    }
}
