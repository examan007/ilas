
   var InitialMargin = 260
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