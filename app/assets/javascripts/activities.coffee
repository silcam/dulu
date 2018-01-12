show_hide_form_sections = () ->
  section_id = '#section-' + $('#activity_type').val()
  $('div.type-specific-part').hide()
  $(section_id).slideDown 'fast'


$(document).ready ->
  switch $('body').data('page-name')
    when 'activities#new', 'activities#create'
      $('#activity_type').change ->
        show_hide_form_sections()