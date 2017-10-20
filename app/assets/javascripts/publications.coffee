
show_hide_media_kinds = () ->
  inputs = $('div#media-kinds').find('input')
  if $('select#publication_kind').val() == 'Media'
    inputs.removeProp('disabled')
    $('div#media-kinds').slideDown('fast')
  else
    $('div#media-kinds').slideUp('fast')
    inputs.prop('disabled', true)

$(document).ready ->
  show_hide_media_kinds()
  $('select#publication_kind').change ->
    show_hide_media_kinds()
