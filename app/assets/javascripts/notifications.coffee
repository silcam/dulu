$(document).ready ->
  $('button.notification-bell').click ->
    span = $(this).find('span.unread-notifications')
    if span.length > 0
      span.removeClass('unread-notifications')
      $.post("/notifications/mark_read")