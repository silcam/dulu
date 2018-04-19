# Locals: event, program

json.call(event, :id, :name)
json.startDate event.start_date
json.endDate event.end_date
json.domain t(event.domain)

json.programId program.id
json.programName program.name
