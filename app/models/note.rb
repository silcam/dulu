# frozen_string_literal: true

# Notes are attached to various models via the `for_type` and `for_id`
# The `for_type` is the class name of the associated model
# and `for_id` is the id of the model instance

class Note < ApplicationRecord
  belongs_to :person

  default_scope { order(created_at: :desc) }

  # Returns the object associated with this note
  def for
    for_type.constantize.find(for_id)
  end

  # Sets the object associated with this note
  def for=(model)
    assign_attributes(for_type: model.class.to_s, for_id: model.id)
  end

  # Find all notes associated with the given model object
  def self.for(model)
    Note.where(for_type: model.class.to_s, for_id: model.id)
  end

  # Returns the authors of the given notes
  def self.people(notes)
    Person.where(id: notes.map(&:person_id))
  end
end
