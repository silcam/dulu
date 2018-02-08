show_hide_divs = (shown, hidden) ->
  for div in shown
    div.find('input').prop('disabled', false)
  for div in hidden
    div.hide()
    div.find('input').prop('disabled', true)
  for div in shown
    div.show()

show_hide_sub_kinds = () ->
  media_div = $('div#media-kinds')
  scripture_div = $('div#scripture-kinds')
  film_div = $('div#film-kinds')
  kind = $('select#publication_kind').val()
  if kind == 'Media'
    shown = [media_div]
    media_kind = media_div.find('input:checked').val()
    if media_kind == 'AudioScripture'
      shown.push(scripture_div)
      hidden = [film_div]
    else if media_kind == 'Video'
      shown.push(film_div)
      hidden = [scripture_div]
    else
      hidden = [film_div, scripture_div]
  else if kind == 'Scripture'
    shown = [scripture_div]
    hidden = [film_div, media_div]
  else
    shown = []
    hidden = [scripture_div, media_div, film_div]
  show_hide_divs(shown, hidden)

$(document).ready ->
  show_hide_sub_kinds()
  $('select#publication_kind').change ->
    show_hide_sub_kinds()
  $('input', '#media-kinds').change ->
    show_hide_sub_kinds()
