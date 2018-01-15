$(document).ready ->
  $('a[data-minimize]').click (e) ->
    e.preventDefault()
    $(this).blur()
    $(this).closest('.minimizable-parent').find('.minimizable').slideToggle 'slow'
    new_text = if $(this).html() == '-' then '+' else '-'
    $(this).html(new_text)