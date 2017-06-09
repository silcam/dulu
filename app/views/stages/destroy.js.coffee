$('#stage-row-view-<%= @stage.id %>').fadeOut('slow', ->
  $('#stage-row-view-<%= @stage.id %>').remove
  $('#stage-row-form-<%= @stage.id %>').remove
)