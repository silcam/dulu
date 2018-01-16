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
  form_group = $('#form-group-scripture')
  if show
    form_group.find('select').prop('disabled', category_select.prop('disabled'))
    form_group.slideDown 'fast'
  else
    form_group.find('select').prop('disabled', true)
    form_group.slideUp 'fast'
  show_hide_form_group_books()

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
