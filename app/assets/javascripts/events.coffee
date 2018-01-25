# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  switch $('body').data('page-name')
    when 'events#new', 'events#edit', 'events#create', 'events#update'
      $('input[data-events-form-submit]').click (e) ->
        unless window.validate_fuzzy_date_form($(this.closest('form')))
          e.preventDefault()

      $('a[data-end-same-as-start-date]').click (e) ->
        e.preventDefault()
        $(this).blur()
        $('#event_end_date_m').val($('#event_start_date_m').val())
        $('#event_end_date_d').val($('#event_start_date_d').val())
        $('#event_end_date_y').val($('#event_start_date_y').val())

    when 'events#show'
      window.update_participant_roles($('select#event_person_id'), $('#event_person_roles'))
      $('select#event_person_id').change ->
        window.update_participant_roles($(this), $('#event_person_roles'))