
   var InitialMargin = 260
   function toggleSidebar() {
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
        var sidebarwidth = $('.sidebar').width() + InitialMargin
        InitialMargin = 0
        if (sidebarwidth >= 260) {
            sidebarwidth = 78
        } else {
            sidebarwidth = 260
        }

        console.log("resize before setting width sbw=[" + sidebarwidth + "]")
       $('section').css("margin-left", "" + sidebarwidth + "px")
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
        if ( newsection === "Services" ) {
            newsection = "Home"
        }
        var newsectionobj = $("#" + newsection)
        console.log(newsectionobj)
        if (newsectionobj.length === 0) {
            console.log("Section=[" + newsection + "] not found!")
        } else {
            $("#" + CurrentSection).css("display", "none");
            newsectionobj.css("display", "block");
            CurrentSection = newsection
            resizeScreen();
            $('.sidebar').addClass('close')
            $('section').css("margin-left", "" + 78 + "px")
        }
        if (newsection === "Booking") {
            $('#login').toggle()
        }
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
        sectionname = sectionname.substring(1)
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
          console.log(currentUrl);

          const hashValue = window.location.hash.slice(1).split("?")[0];
          if ( typeof(hashValue) === 'undefined' ) {
              changeSection('Home')
          } else
          if (hashValue.length <= 0) {
              changeSection('Home')
          } else {
              console.log(hashValue)
              changeSection(hashValue)
          }
            // Add an event listener for the message event
            window.addEventListener("message", receiveMessage, false);
            console.log("Adding event listener")

         function receiveMessage(event) {
           // Check if the message is coming from the expected origin
            console.log("origin=[" + JSON.stringify(event) + "]")
            if (event.isTrusted === true) {
               // Process the message data
               var message = event.data;
               console.log("Received message:", message);
               try {
                 const token = JSON.parse(message).token
                 console.log("token=[" + token + "]")
                 $.cookie('neotoken', token, { expires: 3 })
                 console.log("Cookie set: [" + document.cookie + "] token=[" + token + "]")
               } catch (e) {
                 $('#login').toggle()
               }
            }
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