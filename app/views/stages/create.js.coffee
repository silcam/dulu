
if $(location).attr('href').includes('translation_activities')
  $('#current-stage').html("<%= t(@stage.name) %>")
  $('#update-stage-form').fadeOut('fast', ->
    $('#show-update-form').fadeIn('fast'))
  $('#dulutable').find('tbody').prepend(
      " <%= j (render 'translation_activities/stage_rows',
                stage: @stage) %> "
  )

else
  $('#update-stage-form-<%= @translation_activity.id %>').slideUp(350)
  $('#activity-stage-name-<%= @translation_activity.id %>').html(
    " <%= j (render 'programs/stage_name_link', activity: @translation_activity) %>")
  $('#activity-progress-<%= @translation_activity.id %>').html(
    " <%= j (render 'programs/progress_bar', activity: @translation_activity) %>")