# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

show_hide_stage_inputs = () ->
  book = $('select#activity_bible_book').val()
  if(book=='nt' || book=='ot')
    $('div.stage-input').hide()
  else
    $('div.stage-input').show()


$(document).ready ->

  show_hide_stage_inputs()

  $('select#activity_bible_book').change ->
    show_hide_stage_inputs()


  $('input[data-new-activity-submit]').click (e) ->
    if $('div.input-stage').is(":visible") and not window.validate_fuzzy_date_form($(this.closest('form')))
      e.preventDefault()