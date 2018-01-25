window.mark_invalid = (elements) ->
  form_groups = elements.closest('div.form-group')
  form_groups.addClass('has-error')
  form_groups.find('.help-block').show()

window.validate_not_blank = (elements) ->
  invalid = elements.filter ->
    $(this).val().trim() == ''
  if invalid.length
    window.mark_invalid(invalid)
    return false
  else
    return true