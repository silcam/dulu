show_hide_form_sections = () ->
  section_id = '#section-' + $('#activity_type').val()
  $('div.type-specific-part').hide()
  $('div.type-specific-part').find('input').prop('disabled', true)
  $('div.type-specific-part').find('select').prop('disabled', true)
  $(section_id).find('input').prop('disabled', false)
  $(section_id).find('select').prop('disabled', false)
  $(section_id).slideDown 'fast'
  show_hide_form_group_scripture()

show_hide_form_group_books = () ->
  show = ($('#activity_scripture').val() == 'Other') &&
    ($('select[data-media-category]').first().val() == 'AudioScripture')
  form_group = $('#form-group-books')
  if show
    form_group.find('input').prop('disabled', false)
    form_group.slideDown 'fast'
  else
    form_group.find('input').prop('disabled', true)
    form_group.slideUp 'fast'

show_hide_form_group_scripture = () ->
  category_select = $('select[data-media-category]').first()
  show = category_select.val() == 'AudioScripture'
  scripture_group = $('#form-group-scripture')
  film_group = $('#form-group-film')
  if show
    scripture_group.find('select').prop('disabled', category_select.prop('disabled'))
    film_group.find('select').prop('disabled', true)
    film_group.hide()
    scripture_group.slideDown 'fast'
  else
    film_group.find('select').prop('disabled', category_select.prop('disabled'))
    scripture_group.find('select').prop('disabled', true)
    scripture_group.hide()
    film_group.slideDown 'fast'
  show_hide_form_group_books()

show_hide_form_group_workshops = () ->
  category_select = $('select[data-ling-category]').first()
  show = category_select.val() == 'Workshops'
  workshop_group = $('#workshop-section')
  if show
    workshop_group.slideDown('fast')
  else
    workshop_group.slideUp('fast')


remove_workshop = (btn) ->
  $(btn).closest('div').fadeOut 'fast', ->
    next = $(this).next('div.workshop-group')
    while next.length
      span = next.find('span.number')
      span.html(parseInt(span.text()) - 1)
      next = next.next('div.workshop-group')
    $(this).remove()


$(document).ready ->
  switch $('body').data('page-name')
    when 'activities#new', 'activities#create'
      $('#activity_type').change ->
        show_hide_form_sections()

      show_hide_form_group_scripture()
      $('select[data-media-category]').change ->
        show_hide_form_group_scripture()

      $('#activity_scripture').change ->
        show_hide_form_group_books()

      show_hide_form_group_workshops()
      $('select[data-ling-category]').change ->
        show_hide_form_group_workshops()

      $('a[data-add-workshop]').click (e) ->
        e.preventDefault()
        $(this).blur()
        latest_workshop = $('#workshop-section').find('div.workshop-group').last()
        new_workshop = latest_workshop.clone()
        ws_number = parseInt(new_workshop.find('span.number').text()) + 1
        new_workshop.find('span.number').html(ws_number)
        new_workshop.find('input').val('')
        remove_button = new_workshop.find('a')
        remove_button.click (e) ->
          e.preventDefault()
          remove_workshop(this)
        remove_button.show()
        new_workshop.insertAfter(latest_workshop)

      $('input[type=submit]').click (e) ->
        if $('#activity_type').val() == 'LinguisticActivity'
          if $('#activity_title').val() == ''
            form_group = $('#activity_title').closest('div.form-group')
            form_group.attr('class', 'form-group has-error')
            form_group.find('.help-block').show()
            e.preventDefault()

    when 'activities#show'
      $('.edit_stage').on('ajax:before', () ->
        return window.validate_fuzzy_date_form($(this))
      )

      $('a[data-edit-note]').click (e) ->
        e.preventDefault()
        $('div#view-note').hide('fast')
        $('div#edit-note').show('fast')

      $('a[data-view-note]').click (e) ->
        e.preventDefault()
        $('div#view-note').show('fast')
        $('div#edit-note').hide('fast')
