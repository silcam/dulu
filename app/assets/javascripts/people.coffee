warn_about_duplicate = (response) ->
  dup_warning = $('div#duplicate-warning')
  dup_warning.find('span.duplicate-name').html("#{response.name}")
  if response.email != ''
    dup_warning.find('span.duplicate-email').html("(#{response.email})")
  dup_warning.show()
  $('input[type=submit]').prop('disabled', true)

cancel_duplicate_warning = () ->
  $('div#duplicate-warning').hide()
  $('input[type=submit]').prop('disabled', false)

$(document).ready ->
  $('div#duplicate-check').find('input[type=text]').change ->
    cancel_duplicate_warning()
    first = $('input#person_first_name').val()
    last = $('input#person_last_name').val()
    unless first=='' or last==''
      $.get("/people/find", {first: first, last: last}).done (response) ->
        if response.match
          warn_about_duplicate(response)

  $('input#confirm_not_duplicate').change ->
    $('input[type=submit]').prop('disabled', !this.checked)

  $('input.title-cased').change ->
    name = $(this).val()
    if name == name.toUpperCase() or name == name.toLowerCase()
      name = name[0].toUpperCase() + name[1..-1].toLowerCase()
      $(this).val(name)