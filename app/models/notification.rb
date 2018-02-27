class Notification < ApplicationRecord

  belongs_to :person

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

  def self.new_participant(current_user, participant)
    is_for_a_program = participant.cluster.nil?
    cluster_program_name = participant.cluster_program.name
    details = {
        user_name: current_user.full_name,
        participant_name: participant.full_name,
        cluster_program_name: cluster_program_name,
        is_for_a_program: is_for_a_program
    }

    participant.cluster_program.all_current_people.each do |person|
      unless person == current_user
        person.notifications.create(kind: :new_participant, details: details, assoc_class: Participant, assoc_model_id: participant.id)
      end
    end
  end

  private

  def text_new_participant
    cp_name = details[:cluster_program_name]
    cp_name = details[:is_for_a_program] ? I18n.t(:Program_x, name: cp_name) : I18n.t(:Cluster_x, name: cp_name)
    text_details = details.merge cluster_program_name: cp_name
    I18n.t('notification.new_participant', text_details)
  end
end
