# Locals: event, program

json.call(event, :id, :name, :start_date, :end_date)

json.domain event.domain

json.program_id program.id
json.program_name program.name

# TODO: CLEANUP
