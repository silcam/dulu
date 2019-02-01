# Locals: event, language

json.call(event, :id, :name, :start_date, :end_date)

json.domain event.domain

json.language_id language.id
json.language_name language.name

# TODO: CLEANUP
