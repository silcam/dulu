# frozen_string_literal: true

# Notes are attached to various models via the `for_type` and `for_id`
# The `for_type` is the class name of the associated model
# and `for_id` is the id of the model instance

class Note < ApplicationRecord
  # `for_type` arrives from the client -- Api::NotesController#create permits it
  # straight out of params -- and `#for` constantizes it, which under Zeitwerk
  # autoloads whatever constant it names. This allowlist is what stands between
  # those two facts, so it is enforced on the write (validation, below) and again
  # on the read (`#for`), not once.
  #
  # Keep it in step with `NoteFor` in app/javascript/models/Note.ts, which
  # declares the same three. Production holds only "Language" (checked
  # 2026-09-15); the fixtures also cover "Person", and no UI produces either of
  # the other two today.
  FOR_TYPES = %w[Language Cluster Person].freeze

  belongs_to :person

  validates :for_type, inclusion: { in: FOR_TYPES, message: 'is not something a note can attach to' }
  validates :for_id, presence: true
  validate :target_must_exist

  default_scope { order(updated_at: :desc) }

  # Returns the object associated with this note
  def for
    # Re-checked rather than trusted: the validation above only governs rows
    # written after it, and nothing stops a console from writing another.
    raise ActiveRecord::RecordNotFound, "unknown for_type #{for_type.inspect}" unless FOR_TYPES.include?(for_type)

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

  private

  # A note whose target does not exist is a note `#for` raises on later, so it is
  # refused at the point it would be written instead.
  def target_must_exist
    return if for_id.blank? || !FOR_TYPES.include?(for_type)

    errors.add(:for_id, "is not an existing #{for_type}") unless for_type.constantize.exists?(for_id)
  end
end
