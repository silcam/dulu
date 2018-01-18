# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  switch $('body').data('page-name')
    when 'activities#show', 'programs#show', 'programs#dashboard'
      $('a[data-show-workshop-form]').click (e) ->
        e.preventDefault()
        view_row = $(this).closest('tr')
        view_row.fadeOut 'fast', ->
          view_row.next('.hidden-workshop-form').fadeIn('fast')

      $('a[data-cancel-workshop-form]').click (e) ->
        e.preventDefault()
        form_row = $(this).closest('tr')
        form_row.fadeOut 'fast', ->
          form_row.prev().fadeIn('fast')