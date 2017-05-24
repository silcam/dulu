# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $("a[data-slide-form-id]").click (e) ->
    e.preventDefault()
    $('#update-stage-form-'+$(this).data("slide-form-id")).slideToggle(350);
