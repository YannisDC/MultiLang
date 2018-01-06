$( document ).ready(function() {
  var selectedLanguages = [];
  var lines = $("#lines");
  var languages = [ {
                      "code":"nl",
                      "country": "belgium"
                    },{
                      "code":"pt",
                      "country":"portugal"
                    },{
                      "code":"da",
                      "country":"denmark"
                    },{
                      "code":"fr",
                      "country":"france"
                    },{
                      "code":"de",
                      "country":"germany"
                    },{
                      "code":"is",
                      "country":"iceland"
                    },{
                      "code":"it",
                      "country":"italy"
                    },{
                      "code":"es",
                      "country":"spain"
                    },{
                      "code":"ro",
                      "country":"romania"
                    }];



  $('#add-option').click(function() {
    $(".select").toggle();
  });

  for (var i = 0; i < languages.length; i++) {
    addSelectable(languages[i])
  }

  $('form').submit(function( event ) {
    event.preventDefault();

    for (var i = 0; i < selectedLanguages.length; i++) {
      getTranslation(selectedLanguages[i]);
    }
  });



  function addSelectable(language) {
    var selectable = '<div id="option-'+ language["code"] +'" class="option"><img src="./img/country-flags/png/'+ language["country"] +'.png" style="height: 20px;" alt=""><span style="margin-left:10px;">'+ language["code"] +'</span></div>';
    $(".select").prepend(selectable);

    $('#option-'+language["code"]).click(function() {
      var clicked = language;
      addLanguageOption(clicked);
      $(".select").toggle();
      $(this).remove();
    });
  }

  function addLanguageOption(language) {
    var option = '<li class="nav-item"><div id="lang-'+ language["code"] +'" class="nav-link active"><img src="./img/country-flags/png/'+ language["country"] +'.png" style="height: 20px;" alt=""><span></span></div></li>';
    $(option).insertBefore( $('#add-option').parent() );

    $('#lang-'+language["code"]).mouseenter( function(){$(this).find("span").append("<br>"+language["code"])} ).mouseleave( function(){$(this).find("span").html("")} );
    $('#lang-'+language["code"]).click(function() {
      $(this).toggleClass("disabled");
      $('#translation-'+language["code"]).parent().toggle();
    });

    selectedLanguages.push(language);

    var line = '<div class="row" style="margin-top:20px;"><div class="col"><img src="./img/country-flags/png/'+
    language["country"]+
    '.png" style="height: 40px;" alt=""></div><div id="translation-'+ language["code"] +'" class="col-11 translation" style="font-size:25px;"></div></div>';
    lines.append(line);
  }

  function getTranslation(language) {
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + language["code"] + "&dt=t&q=" + encodeURI($("textarea").val());

    $.get(url, function(data, status) {
      $("#translation-"+language["code"]).html(data[0][0][0]);
    });
  }

  function getSelectionText() {
      var text = "";

      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }

      return text;
  }

  // document.onmouseup = document.onkeyup = function(e) {
  //   if (typeof e !== "undefined" && e.target.classList.contains("translation")) {
  //       var text = getSelectionText();
  //       console.log($(e.target).text());
  //   }
  // };
});
