
hide_div = (hide_me, show_me) ->
  hide_me.slideUp 'fast', ->
    hide_me.find('input').prop('disabled', true)
    if show_me
      show_div(show_me)

show_div = (div) ->
  div.find('input').prop('disabled', false)
  div.slideDown 'fast'

show_hide_sub_kinds = () ->
  kind = $('select#publication_kind').val()
  media_div = $('div#media-kinds')
  scripture_div = $('div#scripture-kinds')
  if kind == 'Media'
    hide_div(scripture_div, media_div)
  else if kind == 'Scripture'
    hide_div(media_div, scripture_div)
  else
    hide_div(media_div)
    hide_div(scripture_div)

$(document).ready ->
  show_hide_sub_kinds()
  $('select#publication_kind').change ->
    show_hide_sub_kinds()
