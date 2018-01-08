$(document).ready ->
  $('a[data-showable-form-show]').click (e) ->
    e.preventDefault()
    div = $(this).closest('div.showable-form-section')
    $(this).fadeOut 'fast'
    div.find('.shown').hide()
    div.find('.not-shown').fadeIn 'fast'

  $('a[data-showable-form-hide]').click (e) ->
    e.preventDefault()
    div = $(this).closest('div.showable-form-section')
    div.find('a[data-showable-form-show]').fadeIn 'fast'
    div.find('.not-shown').fadeOut 'fast', ->
      div.find('.shown').fadeIn 'fast'
