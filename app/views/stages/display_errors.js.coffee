<% message = @stage.errors.full_messages.join("\n") %>

alert("<%= j(message) %>")

# TODO - Replace alert with something on the page