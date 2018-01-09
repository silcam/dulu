show_hide_activity_selects = () ->
  selected_program = $('#activity_program_id').val()
  selects = $('select[name=activity_id]')
  selects.hide()
  selects.prop('disabled', true)
  show_select = $("#program_#{selected_program}_activity_id")
  show_select.prop('disabled', false)
  show_select.fadeIn 'fast'

$(document).ready ->
  switch $('body').data('page-name')
    when 'participants#new', 'participants#edit', 'participants#create', 'participants#update', 'participants#finish'
      $('input[data-participant-submit]').click (e) ->
        unless window.validate_fuzzy_date_form($(this).closest('form'))
          e.preventDefault()

    when 'participants#show'
      show_hide_activity_selects()
      $('#activity_program_id').change ->
        show_hide_activity_selects()
