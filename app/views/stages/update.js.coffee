$('#stage-name-<%= @stage.id %>').html("<%= t @stage.name %>")
$('#stage-date-<%= @stage.id %>').html("<%= pretty_format(@stage.start_date) %>");
$('#stage-row-form-<%= @stage.id %>').fadeOut('fast', ->
  $('#stage-row-view-<%= @stage.id %>').fadeIn()
)
