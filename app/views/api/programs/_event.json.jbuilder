# Locals: event, program

json.call(event, :id, :name, :start_date, :end_date)

json.domain t(event.domain)

json.program_id program.id
json.program_name program.name
