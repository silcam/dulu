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
    def generate(kind, user, object, options={})
      n_params = Notification.send "generate_#{kind}", user, object, options
      return if n_params.nil?
      n_params[:assoc_class] ||= object.class
      n_params[:assoc_model_id] ||= object.id
      n_params[:people].each do |person|
        unless person == user
          person.notifications.create(
              kind: kind,
              details: n_params[:details],
              assoc_class: n_params[:assoc_class],
              assoc_model_id: n_params[:assoc_model_id]
          )
        end
      end
    end
    handle_asynchronously :generate
  end

  private

  def self.generate_new_participant(current_user, participant, options)
    is_for_a_program = participant.cluster.nil?
    cluster_program_name = participant.cluster_program.name
    details = {
        user_name: current_user.full_name,
        participant_name: participant.full_name,
        cluster_program_name: cluster_program_name,
        is_for_a_program: is_for_a_program
    }

    return {
        people: participant.cluster_program.all_current_people,
        details: details
    }
  end

  def text_new_participant
    cp_name = details[:cluster_program_name]
    cp_name = details[:is_for_a_program] ? I18n.t(:Program_x, name: cp_name) : I18n.t(:Cluster_x, name: cp_name)
    text_details = details.merge cluster_program_name: cp_name
    I18n.t('notification.new_participant', text_details)
  end

  def self.generate_new_stage(user, stage, options)
    stage.reload
    return nil unless stage.current
    details = {
        user_name: user.full_name,
        program_name: stage.activity.program.name,
        stage_name: stage.name
    }

    return {
        people: stage.activity.program.all_current_people,
        details: details,
        assoc_class: Activity,
        assoc_model_id: stage.activity.id
    }
  end

  def text_new_stage
    stage_name = I18n.t(details[:stage_name], default: details[:stage_name])
    text_details = details.merge activity_name: assoc_model.name, stage_name: stage_name
    I18n.t('notification.new_stage', text_details)
  end

  def self.generate_new_activity(user, activity, options)
    details = {
        user_name: user.full_name,
        program_name: activity.program.name
    }
    if ['nt', 'ot'].include? options[:bible_book_id]
      details[:activity_name] = (options[:bible_book_id]=='nt') ? :The_new_testament : :The_old_testament
      assoc_class = Program
      assoc_model_id = activity.program.id
    else
      assoc_class = Activity
      assoc_model_id = activity.id
    end

    return {
        people: activity.program.all_current_people,
        details: details,
        assoc_class: assoc_class,
        assoc_model_id: assoc_model_id
    }
  end

  def text_new_activity
    activity_name = details[:activity_name].nil? ? assoc_model.name : I18n.t(details[:activity_name])
    program_name = I18n.t(:Program_x, name: details[:program_name])
    text_details = {user_name: details[:user_name], activity_name: activity_name, program_name: program_name}
    I18n.t('notification.new_activity', text_details)
  end
end
