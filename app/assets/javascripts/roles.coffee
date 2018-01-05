window.update_participant_roles = (select, checkbox_container) ->
  form = select.closest('form')
  submit_button = form.find('input[type=submit]').first()
  submit_button.prop('disabled', true)
  person_id = select.val()
  $.get("/people/#{person_id}.json").done (person) ->
    checkbox_container.html('')
    for role in person.roles
      new_check_lbl = form.find('label.checkbox-inline').first().clone()
      new_check_lbl.find('input').first().val(role.role)
      new_check_lbl.contents().last().replaceWith(role.t_role)
      checkbox_container.append(new_check_lbl)
    submit_button.prop('disabled', false)