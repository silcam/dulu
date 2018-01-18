class Workshop < ApplicationRecord
  belongs_to :linguistic_activity, required: true
  belongs_to :event, required: false

  validates :number, numericality: {only_integer: true}
  validates :name, presence: true, allow_blank: false

  default_scope { order :number }

  def stage
    linguistic_activity.stages.find_by(name: name)
  end

  def set_event_defaults(event)
    event.assign_attributes(
         name: "#{I18n.t(:Workshop)}: #{name}",
         domain: :Linguistics
    )
  end

  def complete(params)
    date = (event.nil?) ?
               params[:date] :
               event.end_date
    linguistic_activity.stages.create!(
        kind: :Linguistic,
        name: name,
        start_date: date
    )
  end
end
