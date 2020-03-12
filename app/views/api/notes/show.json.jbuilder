# frozen_string_literal: true

json.partial! 'api/notes/notes', notes: [@note]

json.partial! 'api/people/people', people: [@note.person]
