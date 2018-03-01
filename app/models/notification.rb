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
        people: participant.cluster_program.all_current_people,
        details: details
    }
  end

  # def text_new_participant
  #   cp_name = details[:cluster_program_name]
  #   cp_name = details[:is_for_a_program] ? I18n.t(:Program_x, name: cp_name) : I18n.t(:Cluster_x, name: cp_name)
  #   text_details = details.merge cluster_program_name: cp_name
  #   I18n.t('notification.new_participant', text_details)
  # end

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

  # def text_new_stage
  #   stage_name = I18n.t(details[:stage_name], default: details[:stage_name])
  #   text_details = details.merge activity_name: assoc_model.name,
  #                                stage_name: stage_name
  #   I18n.t('notification.new_stage', text_details)
  # end

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

  # def text_workshop_complete
  #   I18n.t('notification.workshop_complete', details)
  # end

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

  # def text_new_activity
  #   activity_name = details[:activity_name].nil? ? assoc_model.name : I18n.t(details[:activity_name])
  #   text_details = details.merge activity_name: activity_name
  #   I18n.t('notification.new_activity', text_details)
  # end
end
