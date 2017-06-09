$('#stage-name-<%= @stage.id %>').html("<%= t @stage.name %>")
$('#stage-date-<%= @stage.id %>').html("<%= @stage.f_start_date.pretty_print %>");
$('#stage-row-form-<%= @stage.id %>').fadeOut('fast', ->
  $('#stage-row-view-<%= @stage.id %>').fadeIn()
)
