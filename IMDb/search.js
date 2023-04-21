$(document).ready(function(){
  $.ajaxSetup({ cache: false });
  $('#search').keyup(function(){
   var searchField = $(this).val();
   var expression = new RegExp(searchField, "i");
   if (searchField === '') {
     $('#result li').css('display', 'none');
     $('#state').val('');
   } else {
     $('#result').html('');
     $('#state').val('');
     $.getJSON('search.json', function(data) {
      $.each(data, function(key, value){
       if (value.name.search(expression) != -1 || value.directer.search(expression) != -1)
       {
        $('#result').append('<li class="list-group-item link-class" data-url="'+value.path+'"><img src="'+value.image+'" height="40" width="40" class="img-thumbnail" /> '+value.name+' <span class="directer">'+value.directer+'</span></li>');
       }
      });   
     });
   }
  });
  
  $('#result').on('click', 'li', function() {
   var path = $(this).data('url');
   if (path) {
     window.location.href = path;
   } else {
     var click_text = $(this).text().split('|');
     $('#search').val($.trim(click_text[0]));
     $("#result").html('');
   }
  });
 });
