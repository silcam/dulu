# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $('select#activity_bible_book').change ->
    book = $(this).val()
    if(book=='nt' || book=='ot')
      $('p#multiple-stages-hint').show()
    else
      $('p#multiple-stages-hint').hide()

  $('input[data-new-activity-submit]').click (e) ->
    unless window.validate_fuzzy_date_form($(this.closest('form')))
      e.preventDefault()