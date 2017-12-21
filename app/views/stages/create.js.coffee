if $(location).attr('href').indexOf('translation_activities') >= 0
  $('#current-stage').html("<%= t(@stage.name) %>")
  $('#update-stage-form').fadeOut('fast', ->
    $('#show-update-form').fadeIn('fast'))
  $('#dulutable').find('tbody').prepend(
      " <%= j (render 'translation_activities/stage_rows',
                stage: @stage) %> "
  )
  window.add_edit_stage_click_handlers()

else
  <% id = @translation_activity.id %>
  $('#update-stage-form-<%= id %>').slideUp(350)
  $('#activity-progress-<%= id %>').html(
    " <%= j(render 'programs/progress_bar', activity: @translation_activity) %>")
  $('a[data-slide-form-id=<%= id %>]').html(
    " <%= t(@translation_activity.stage_name) %>")
  $('#activity-stage-date-<%= id %>').html(
    " (<%= @translation_activity.current_stage.f_start_date.try(:pretty_print) %>)")
  $('#activity-participants-<%= id %>').html(
    " <%= j(render 'programs/participants', activity: @translation_activity) %>")
