
$(document).ready ->
  $("a[data-check-all]").click (e) ->
    e.preventDefault()
    $(this).blur()
    $(this).closest('div.form-group')
                          .find("input[type='checkbox']")
                          .prop('checked', true)

  $("a[data-check-none]").click (e) ->
    e.preventDefault()
    $(this).blur()
    $(this).closest('div.form-group')
            .find("input[type='checkbox']")
            .prop('checked', false)

  $("a[data-reveal-truncated]").click (e) ->
    e.preventDefault()
    $(this).blur()
    $(this).closest('.revealable-truncate').find('.truncate-more').hide()
    $(this).closest('.revealable-truncate').find('.truncate-remainder').show()
