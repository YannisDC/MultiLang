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
                    },{
                      "code":"ca",
                      "country":"catalonia"
                    },{
                      "code":"sq",
                      "country":"albania"
                    },{
                      "code":"ru",
                      "country":"russia"
                    },{
                      "code":"hu",
                      "country":"hungary"
                    },{
                      "code":"ja",
                      "country":"japan"
                    },{
                      "code":"ht",
                      "country":"haiti"
                    },{
                      "code":"bg",
                      "country":"bulgaria"
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
    addRequery();
  });

  $('.topology').hide();

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
      $("#translation-"+language["code"]).data("sentence", data[0][0][0]);
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

  function addRequery() {
    $("#third-query").html($("#second-query").html());
    if ($("#third-query").html()) {
      $("#third-requery").show();
    }
    $("#second-query").html($("#first-query").html());
    if ($("#second-query").html()) {
      $("#second-requery").show();
    }
    $("#first-query").html($("textarea").val());
    if ($("#first-query").html()) {
      $("#first-requery").show();
    }
  }

  $("#first-requery").hide();
  $("#second-requery").hide();
  $("#third-requery").hide();

  $('#first-requery').click(function() {
    $("textarea").val($("#first-query").html());
    for (var i = 0; i < selectedLanguages.length; i++) {
      getTranslation(selectedLanguages[i]);
    }
  });

  $('#second-requery').click(function() {
    $("textarea").val($("#second-query").html());
    for (var i = 0; i < selectedLanguages.length; i++) {
      getTranslation(selectedLanguages[i]);
    }
  });

  $('#third-requery').click(function() {
    $("textarea").val($("#third-query").html());
    for (var i = 0; i < selectedLanguages.length; i++) {
      getTranslation(selectedLanguages[i]);
    }
  });

  function mark(e, sentence, text, topology) {
    var partOne = sentence.substring(0, sentence.indexOf(text));
    var partTwo = sentence.substring(sentence.indexOf(text), sentence.indexOf(text) + text.length);
    var partThree = sentence.substring(sentence.indexOf(text) + text.length, sentence.length);

    var newSentence = partOne + '<mark class='+topology+'>' + partTwo + '</mark>' + partThree;
    $(e.target).html(newSentence);

    $('.subj').tooltip({title: "Subject"});
    $('.verb').tooltip({title: "Verb"});
    $('.obj').tooltip({title: "Object"});
    $('.adj').tooltip({title: "Adjective"});

    $('.topology').hide("slow");
  }

  document.onmouseup = document.onkeyup = function(e) {
    if (typeof e !== "undefined" && e.target.classList.contains("translation")) {
        var text = getSelectionText();
        // var sentence = $(e.target).data("sentence");
        var sentence = $(e.target).html();

        console.log(text);
        console.log(sentence);
        console.log(sentence.indexOf(text));
        console.log(sentence.indexOf(text) + text.length);

        if (text.length != 0) {
          $('.topology').show("slow");

          // FIXME: click listener issue

          $('#top-subj').click(function() {
            mark(e, sentence, text, "subj");
          });

          $('#top-verb').click(function() {
            mark(e, sentence, text, "verb");
          });

          $('#top-obj').click(function() {
            mark(e, sentence, text, "obj");
          });

          $('#top-adj').click(function() {
            mark(e, sentence, text, "adj");
          });
        }
    }
  };
});
