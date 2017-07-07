
$(document).ready ->
  $("a[data-check-all]").click (e) ->
    e.preventDefault()
    $(this).closest('div.form-group')
                          .find("input[type='checkbox']")
                          .prop('checked', true)

  $("a[data-check-none]").click (e) ->
    e.preventDefault()
    $(this).closest('div.form-group')
            .find("input[type='checkbox']")
            .prop('checked', false)