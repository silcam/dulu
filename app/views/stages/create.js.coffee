if $(location).attr('href').includes('translation_activities')
  $('#current-stage').html("<%= t(@stage.name) %>")
  $('#update-stage-form').fadeOut('fast', ->
    $('#show-update-form').fadeIn('fast'))
  $('#dulutable').find('tbody').prepend(
      " <%= j (render 'translation_activities/stage_rows',
                stage: @stage) %> "
  )

else
  <% id = @translation_activity.id %>
  $('#update-stage-form-<%= id %>').slideUp(350)
  $('#activity-progress-<%= id %>').html(
    " <%= j(render 'programs/progress_bar', activity: @translation_activity) %>")
  $('#activity-stage-name-<%= id %>').html(
    " <%= j(render 'programs/stage_name_link', activity: @translation_activity) %>")
  $('#activity-stage-date-<%= id %>').html(
    " <%= @translation_activity.current_stage.f_start_date.pretty_print %>")
  $('#activity-participants-<%= id %>').html(
    " <%= j(render 'programs/participants', activity: @translation_activity) %>")

  $("a[data-slide-form-id]").click (e) ->
    e.preventDefault()
    $('#update-stage-form-'+$(this).data("slide-form-id")).slideToggle(350);