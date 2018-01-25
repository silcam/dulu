$('#stage-row-view-<%= @stage.id %>').fadeOut('slow', ->
  $('#stage-row-view-<%= @stage.id %>').remove
  $('#stage-row-form-<%= @stage.id %>').remove
)

$('#current-stage').html(
  "<%= t(@activity.current_stage.name, default: @activity.current_stage.name.to_s) %>"
)