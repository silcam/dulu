show_hide_form_sections = () ->
  section_id = '#section-' + $('#activity_type').val()
  $('div.type-specific-part').hide()
  $(section_id).slideDown 'fast'

show_hide_form_group_scripture = () ->
  show = $('select[data-media-category]').first().val() == 'AudioScripture'
  form_group = $('#form-group-scripture')
  if show
    form_group.find('select').prop('disabled', false)
    form_group.slideDown 'fast'
  else
    form_group.find('select').prop('disabled', true)
    form_group.slideUp 'fast'

$(document).ready ->
  switch $('body').data('page-name')
    when 'activities#new', 'activities#create'
      $('#activity_type').change ->
        show_hide_form_sections()

      show_hide_form_group_scripture()
      $('select[data-media-category]').change ->
        show_hide_form_group_scripture()