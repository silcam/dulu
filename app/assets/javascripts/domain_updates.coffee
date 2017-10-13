# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $('input[data-domain-updates-form-submit]').click (e) ->
    unless window.validate_fuzzy_date_form($(this.closest('form')))
      e.preventDefault()