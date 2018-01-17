if $(location).attr('href').indexOf('activities') >= 0
  $('#current-stage').html("<%= t(@stage.name, default: @stage.name.to_s) %>")
  $('#update-stage-form').fadeOut('fast', ->
    $('#show-update-form').fadeIn('fast'))
  $('#dulutable').find('tbody').prepend(
      " <%= j (render 'translation_activities/stage_rows',
                stage: @stage) %> "
  )
  window.add_edit_stage_click_handlers()

else
  <% id = @activity.id %>
  $('#update-stage-form-<%= id %>').slideUp(350)
  $('#activity-progress-<%= id %>').html(
    " <%= j(render 'programs/progress_bar', activity: @activity) %>")
  $('a[data-slide-form-id=<%= id %>]').html(
    " <%= t(@activity.stage_name, default: @activity.stage_name.to_s) %>")
  $('#activity-stage-date-<%= id %>').html(
    " (<%= @activity.current_stage.f_start_date.try(:pretty_print) %>)")
  $('#activity-participants-<%= id %>').html(
    " <%= j(render 'programs/participants', activity: @activity) %>")
