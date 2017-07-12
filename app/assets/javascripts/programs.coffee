# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $("a[data-slide-form-id]").click (e) ->
    e.preventDefault()
    $('#update-stage-form-'+$(this).data("slide-form-id")).slideToggle(350)

  $("button[data-form-cancel-id]").click (e) ->
    e.preventDefault()
    id = $(this).data('form-cancel-id')
    $('div#update-stage-form-'+id).slideUp(350)
    $(this).closest('div#update-stage-form').fadeOut('fast', ->
      $('button#show-update-form').fadeIn('fast')
    )
