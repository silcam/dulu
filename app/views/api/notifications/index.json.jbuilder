message = {key: 'new_participant', vars: { user_name: 'Rick Conrad', participant_name: 'Biggy Smalls', cluster_program_name: 'Hdi'}, 
          links: {user_name: person_path(1), participant_name: participant_path(2), cluster_program_name: program_path(4)}}
json.array! @notifications do |notification|
  json.id notification.id

  json.message message
  # json.html ApplicationController.new.render_to_string(partial: 'notifications/text', locals: {notification: notification}, format: :html)
  # json.html ApplicationController.render(file: 'notifications/_text', locals: {notification: notification})
  # json.html raw(render(partial: 'notifications/text', formats: [:html], locals: {notification: notification}))
  # json.html render(template: 'notifications/_text.html.erb', locals: {notification: notification})
end