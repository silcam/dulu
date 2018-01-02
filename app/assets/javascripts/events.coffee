# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $('input[data-events-form-submit]').click (e) ->
    unless window.validate_fuzzy_date_form($(this.closest('form')))
      e.preventDefault()

  $('a[data-end-same-as-start-date]').click (e) ->
    e.preventDefault()
    $('#event_end_date_m').val($('#event_start_date_m').val())
    $('#event_end_date_d').val($('#event_start_date_d').val())
    $('#event_end_date_y').val($('#event_start_date_y').val())

  $('a[data-add-program-select]').click (e) ->
    e.preventDefault()
    hidden_select = $('div.program-select').last()
    hidden_select.after(hidden_select.clone())
    hidden_select.find('select').removeProp('disabled')
    hidden_select.fadeIn('fast')

  $('a[data-add-cluster-select]').click (e) ->
    e.preventDefault()
    hidden_select = $('div.cluster-select').last()
    hidden_select.after(hidden_select.clone())
    hidden_select.find('select').removeProp('disabled')
    hidden_select.fadeIn('fast')

  $('div.select-collection').on('click', 'a[data-remove-select]', (e) ->
    e.preventDefault()
    delete_me = $(this).closest('div.select')
    delete_me.fadeOut('fast', ->
      delete_me.remove()
    )
  )

  $('a[data-add-person-select]').click (e) ->
    e.preventDefault()
    copy_me = $('div.person-select').last()
    new_div = copy_me.clone()
    new_div.find('a[data-remove-select]').show()
    new_div.hide()
    copy_me.after(new_div)
    new_div.fadeIn('fast')

