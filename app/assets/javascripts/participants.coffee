$(document).ready ->
  $('input[data-participant-submit]').click (e) ->
    unless window.validate_fuzzy_date_form($(this).closest('form'))
      e.preventDefault()