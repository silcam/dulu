$(document).ready ->
  $('.edit_stage').on('ajax:before', () ->
    return window.validate_fuzzy_date_form($(this))
  )