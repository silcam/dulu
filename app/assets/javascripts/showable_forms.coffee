$(document).ready ->
  $('a[data-showable-form-show]').click (e) ->
    e.preventDefault()
    $(this).blur()
    div = $(this).closest('div.showable-form-section')
    div.find('.shown').hide()
    $(this).fadeOut 'fast', ->
      div.find('.not-shown').fadeIn 'fast'

  $('a[data-showable-form-hide]').click (e) ->
    e.preventDefault()
    $(this).blur()
    div = $(this).closest('div.showable-form-section')
    div.find('.not-shown').fadeOut 'fast', ->
      div.find('.shown').fadeIn 'fast'
      div.find('a[data-showable-form-show]').fadeIn 'fast'
