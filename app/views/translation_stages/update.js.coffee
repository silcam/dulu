$('#stage-name-<%= @translation_stage.id %>').html("<%= t @translation_stage.name %>")
$('#stage-date-<%= @translation_stage.id %>').html("<%= pretty_format(@translation_stage.start_date) %>");
$('#stage-row-form-<%= @translation_stage.id %>').fadeOut('fast', ->
  $('#stage-row-view-<%= @translation_stage.id %>').fadeIn()
)
