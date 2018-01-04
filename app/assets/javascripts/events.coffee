# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

update_person_roles = (select) ->
  form = select.closest('form')
  submit_button = form.find('input[type=submit]').first()
  submit_button.prop('disabled', true)
  person_id = select.val()
  $.get("/people/#{person_id}.json").done (person) ->
    $('#event_person_roles').html('')
    for role in person.roles
      new_check_lbl = form.find('label.checkbox-inline').first().clone()
      new_check_lbl.find('input').first().val(role.role)
      new_check_lbl.contents().last().replaceWith(role.t_role)
      $('#event_person_roles').append(new_check_lbl)
    submit_button.prop('disabled', false)


$(document).ready ->
  switch $('body').data('page-name')
    when 'events#new', 'events#edit', 'events#create', 'events#update'
      $('input[data-events-form-submit]').click (e) ->
        unless window.validate_fuzzy_date_form($(this.closest('form')))
          e.preventDefault()

      $('a[data-end-same-as-start-date]').click (e) ->
        e.preventDefault()
        $('#event_end_date_m').val($('#event_start_date_m').val())
        $('#event_end_date_d').val($('#event_start_date_d').val())
        $('#event_end_date_y').val($('#event_start_date_y').val())

    when 'events#show'
      $('a[data-event-enable-edits]').click (e) ->
        e.preventDefault()
        $(this).closest('div.event-page-section').find('.not-shown').fadeIn 'fast'
        $(this).closest('small').fadeOut 'fast'

      $('a[data-event-cancel-form]').click (e) ->
        e.preventDefault()
        $(this).closest('div.event-page-section').find('.not-shown').fadeOut 'fast'
        $(this).closest('div.event-page-section').find('small').first().fadeIn 'fast'

      update_person_roles($('select#event_person_id'))
      $('select#event_person_id').change ->
        update_person_roles($(this))