class Notification < ApplicationRecord

  belongs_to :person

  default_scope{ order(created_at: :desc) }

  def details
    if @details.nil?
      @details = JSON.parse(details_json, symbolize_names: true)
    end
    @details
  end

  def details=(details_hash)
    self.details_json = JSON.generate details_hash
  end

  def text
    send "text_#{kind}"
  end

  def assoc_model
    assoc_class.constantize.find_by id: assoc_model_id
  end

  class << self
    def generate(kind, user, object, details={})
      details[:user_name] = user.full_name
      details[:user_id] = user.id
      n_params = Notification.send "generate_#{kind}", object, details
      return if n_params.nil?
      n_params[:people].each do |person|
        unless person == user
          person.notifications.create(
              kind: kind,
              details: n_params[:details]
          )
        end
      end
    end
    handle_asynchronously :generate
  end

  private

  def self.generate_new_participant(participant, details)
    details.merge!(
        participant_name: participant.full_name,
        participant_id: participant.id,
        cluster_program_name: participant.cluster_program.name,
        cluster_program_id: participant.cluster_program.id,
        is_for_a_program: participant.cluster.nil?
    )

    return {
        people: participant.cluster_program.all_current_people.reject{ |p| p==participant.person },
        details: details
    }
  end

  def self.generate_new_stage(stage, details)
    stage.reload
    return nil unless stage.current
    details.merge!(
        program_name: stage.activity.program.name,
        program_id: stage.activity.program.id,
        stage_name: stage.name,
        activity_id: stage.activity.id
    )

    return {
        people: stage.activity.program.all_current_people,
        details: details
    }
  end

  def self.generate_workshop_complete(workshop, details)
    details.merge!(
        workshop_name: workshop.name,
        program_name: workshop.linguistic_activity.program.name,
        program_id: workshop.linguistic_activity.program.id,
        activity_id: workshop.linguistic_activity.id
    )
    return {
        people: workshop.linguistic_activity.program.all_current_people,
        details: details
    }
  end

  def self.generate_new_activity(activity, details)
    details.merge!(
        program_name: activity.program.name,
        program_id: activity.program.id,
        activity_id: activity.id
    )

    return {
        people: activity.program.all_current_people,
        details: details
    }
  end

  def self.generate_added_a_testament(program, details)
    testament = details[:testament]=='nt' ? :New_testament : :Old_testament
    details.merge!(
        program_name: program.name,
        program_id: program.id,
        testament: testament
    )
    return {
        people: program.all_current_people,
        details: details
    }
  end

  def self.generate_updated_you(person, details)
    return {
        people: [person],
        details: details
    }
  end

  def self.generate_gave_you_role(person, details)
    return {
        people: [person],
        details: details
    }
  end

  def self.generate_added_you_to_program(participant, details)
    details.merge!(
               program_name: participant.program.name,
               program_id: participant.program.id
    )
    return {
        people: [participant.person],
        details: details
    }
  end

  def self.generate_added_you_to_activity(participant, details)
    details.merge!(
               program_name: participant.program.name,
               program_id: participant.program.id
    )
    return {
        people: [participant.person],
        details: details
    }
  end

  def self.generate_added_you_to_event(event_participant, details)
    details.merge!(
               event_name: event_participant.event.name,
               event_id: event_participant.event.id,
    )
    return {
        people: [event_participant.person],
        details: details
    }
  end

  def self.generate_new_event_for_program(event, details)
    program = Program.find details[:program_id]
    details.merge!(
               program_name: program.name,
               event_name: event.name,
               event_id: event.id
    )
    return {
        people: program.current_people,
        details: details
    }
  end

  def self.generate_added_program_to_event(event, details)
    generate_new_event_for_program event, details
  end

  def self.generate_added_cluster_to_event(event, details)
    cluster = Cluster.find details[:cluster_id]
    details.merge!(
        cluster_name: cluster.name,
        event_name: event.name,
        event_id: event.id
    )
    return {
        people: cluster.current_people,
        details: details
    }
  end
end
