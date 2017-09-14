$(document).ready ->
  $('.edit_stage').on('ajax:before', () ->
    return window.validate_fuzzy_date_form($(this))
  )

  $('a[data-edit-note]').click (e) ->
    e.preventDefault()
    $('div#view-note').hide('fast')
    $('div#edit-note').show('fast')

  $('a[data-view-note]').click (e) ->
    e.preventDefault()
    $('div#view-note').show('fast')
    $('div#edit-note').hide('fast')