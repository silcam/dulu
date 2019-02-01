class Notification < ApplicationRecord

  belongs_to :person, required: false

  default_scope{ order(created_at: :desc) }

  def vars
    if @vars.nil?
      @vars = JSON.parse(vars_json, symbolize_names: true)
    end
    @vars
  end

  def t_vars
    t_var_hash = {}
    vars.each do |key, var|
      t_var_hash[key] = var.is_a?(Hash) ? 
                          var[I18n.locale] :
                          var
    end
    t_var_hash
  end

  def vars=(vars_hash)
    self.vars_json = JSON.generate vars_hash
  end

  def links
    if @links.nil?
      @links = JSON.parse(links_json, symbolize_names: true)
    end
    @links
  end

  def links=(links_hash)
    self.links_json = JSON.generate links_hash
  end

  # def assoc_model
  #   assoc_class.constantize.find_by id: assoc_model_id
  # end

  def email
    if person.email_pref == 'immediate'
      NotificationMailer.delay.notify(self)
    end
  end

  class << self
    include TranslationHelper
    def model_path(instance)
      return ApplicationController.helpers.model_path(instance)
    end

    def global
      where(person: nil)
    end

    def new_program_participant(user, participant)
      program = participant.language
      n_params = {
        kind: :new_program_participant,
        vars: {
          user_name: user.full_name,
          participant_name: participant.full_name,
          program_name: program.name
        },
        links: {
          user_name: model_path(user),
          participant_name: model_path(participant),
          program_name: model_path(program)
        }
      }
      people = cluster_program_people(program, user, participant.person)
      send_notification n_params, people

      n_params[:kind] = :added_you_to_program
      send_notification n_params, [participant.person], false
    end
    handle_asynchronously :new_program_participant

    def new_cluster_participant(user, participant)
      cluster = participant.cluster
      n_params = {
        kind: :new_cluster_participant,
        vars: {
          user_name: user.full_name,
          participant_name: participant.full_name,
          cluster_name: cluster.name
        },
        links: {
          user_name: model_path(user),
          participant_name: model_path(participant),
          cluster_name: model_path(cluster)
        }
      }
      people = cluster_program_people(cluster, user, participant.person)
      send_notification n_params, people

      n_params[:kind] = :added_you_to_cluster
      send_notification n_params, [participant.person], false
    end
    handle_asynchronously :new_cluster_participant

    def new_stage(user, stage)
      activity = stage.activity
      program = activity.language
      n_params = {
        kind: :new_stage,
        vars: {
          user_name: user.full_name,
          activity_name: activity_name(activity),
          stage_name: t_hash(stage.name),
          program_name: program.name
        },
        links: {
          user_name: model_path(user),
          activity_name: model_path(activity),
          program_name: model_path(program)          
        }
      }
      send_notification n_params, cluster_program_people(program, user)      
    end
    handle_asynchronously :new_stage

    def workshop_complete(user, workshop)
      program = workshop.linguistic_activity.language
      n_params = {
        kind: :workshop_complete,
        vars: {
          user_name: user.full_name,
          workshop_name: workshop.name,
          program_name: program.name
        },
        links: {
          user_name: model_path(user),
          workshop_name: model_path(workshop.linguistic_activity),
          program_name: model_path(program)
        }
      }
      send_notification n_params, cluster_program_people(program, user)
    end
    handle_asynchronously :workshop_complete

    def new_activity(user, activity)
      program = activity.language
      n_params = {
        kind: :new_activity,
        vars: {
          user_name: user.full_name,
          program_name: program.name,
          activity_name: activity_name(activity)
        },
        links: {
          user_name: model_path(user),
          program_name: model_path(program),
          activity_name: model_path(activity)
        }
      }
      send_notification n_params, cluster_program_people(program, user)
    end
    handle_asynchronously :new_activity

    # # testament one of :New_testament or :Old_testament
    # def added_a_testament(user, testament, program)
    #   n_params = {
    #     kind: :added_a_testament,
    #     vars: {
    #       user_name: user.full_name,
    #       program_name: program.name,
    #       testament: t_hash(testament)
    #     },
    #     links: {
    #       user_name: model_path(user),
    #       program_name: model_path(program)
    #     }
    #   }
    #   send_notification n_params, cluster_program_people(program, user)
    # end
    # handle_asynchronously :added_a_testament

    def updated_you(user, person)
      return updated_himself(user) if user == person
      n_params = {
        kind: :updated_you,
        vars: {
          user_name: user.full_name,
          your_info: t_hash('notification.your_info'),
          person_name: person.full_name
        },
        links: {
          user_name: model_path(user),
          your_info: model_path(person),
          person_name: model_path(person)
        }
      }
      send_notification n_params, [person], true, :updated_person
    end
    handle_asynchronously :updated_you

    def updated_himself(user)
      n_params = {
        kind: :updated_himself,
        vars: {
          user_name: user.full_name,
          his: t_hash("notification.his.#{user.gender}")
        },
        links: {
          user_name: model_path(user)
        }
      }
      send_notification n_params, []  # Global only
    end

    def gave_you_role(user, person, role)
      return gave_himself_role(user, role) if user == person
      n_params = {
        kind: :gave_you_role,
        vars: {
          user_name: user.full_name,
          role_name: t_hash(role),
          person_name: person.full_name
        },
        links: {
          user_name: model_path(user),
          person_name: model_path(person)
        }
      }
      send_notification n_params, [person], true, :gave_person_role
    end
    handle_asynchronously :gave_you_role

    def gave_himself_role(user, role)
      n_params = {
        kind: :gave_himself_role,
        vars: {
          user_name: user.full_name,
          himself: t_hash("notification.himself.#{user.gender}"),
          role_name: t_hash(role)
        },
        links: {
          user_name: model_path(user)
        }
      }
      send_notification n_params, []  # Global only
    end

    def added_person_to_activity(user, person, activity)
      return added_himself_to_activity(user, activity) if user == person
      program = activity.language
      n_params = {
        kind: :added_person_to_activity,
        vars: {
          user_name: user.full_name,
          person_name: person.full_name,
          activity_name: activity_name(activity),
          program_name: program.name
        },
        links: {
          user_name: model_path(user),
          person_name: model_path(person),
          activity_name: model_path(activity),
          program_name: model_path(program)
        }
      }
      people = cluster_program_people(activity.language, user, person)
      send_notification n_params, people

      n_params[:kind] = :added_you_to_activity
      send_notification n_params, [person], false
    end
    handle_asynchronously :added_person_to_activity

    def added_himself_to_activity(user, activity)
      n_params = {
        kind: :added_himself_to_activity,
        vars: {
          user_name: user.full_name,
          himself: t_hash("notification.himself.#{user.gender}"),
          activity_name: activity_name(activity),
          program_name: activity.language.name
        },
        links: {
          user_name: model_path(user),
          activity_name: model_path(activity),
          program_name: model_path(activity.language)
        }
      }
      people = cluster_program_people(activity.language, user)
      send_notification n_params, people
    end

    def added_person_to_event(user, event_participant)
      return added_himself_to_event(user, event_participant) if user == event_participant.person
      person = event_participant.person
      event = event_participant.event
      n_params = {
        kind: :added_person_to_event,
        vars: {
          user_name: user.full_name,
          person_name: person.full_name,
          event_name: event.name
        },
        links: {
          user_name: model_path(user),
          person_name: model_path(person),
          event_name: model_path(event)
        }
      }
      people = event.people - [user, person]
      send_notification n_params, people
      
      n_params[:kind] = :added_you_to_event
      send_notification n_params, [person], false
    end
    handle_asynchronously :added_person_to_event

    def added_himself_to_event(user, event_participant)
      n_params = {
        kind: :added_himself_to_event,
        vars: {
          user_name: user.full_name,
          himself: t_hash("notification.himself.#{user.gender}"),
          event_name: event_participant.event.name
        },
        links: {
          user_name: model_path(user),
          event_name: model_path(event_participant.event)
        }
      }
      people = event_participant.event.people - [user]
      send_notification n_params, people
    end

    def new_event_for_program(user, event, program)
      n_params = {
        kind: :new_event_for_program,
        vars: {
          user_name: user.full_name,
          event_name: event.name,
          program_name: program.name
        },
        links: {
          user_name: model_path(user),
          event_name: model_path(program) + model_path(event),
          program_name: model_path(program)
        }
      } 
      send_notification n_params, cluster_program_people(program, user)
    end
    handle_asynchronously :new_event_for_program

    def added_program_to_event(user, program, event)
      n_params = {
        kind: :added_program_to_event,
        vars: {
          user_name: user.full_name,
          program_name: program.name,
          event_name: event.name
        },
        links: {
          user_name: model_path(user),
          program_name: model_path(program),
          event_name: model_path(program) + model_path(event)
        }
      }
      send_notification n_params, cluster_program_event_people(program, event, user)
    end
    handle_asynchronously :added_program_to_event

    def added_cluster_to_event(user, cluster, event)
      n_params = {
        kind: :added_cluster_to_event,
        vars: {
          user_name: user.full_name,
          cluster_name: cluster.name,
          event_name: event.name
        },
        links: {
          user_name: model_path(user),
          cluster_name: model_path(cluster),
          event_name: model_path(event)
        }
      }
      send_notification n_params, cluster_program_event_people(cluster, event, user)
    end
    handle_asynchronously :added_cluster_to_event

    private

    def send_notification(n_params, people, send_global=true, global_kind=nil)
      people.each do |person|
        notification = person.notifications.create n_params
        notification.email
      end

      return unless send_global
      global_kind ||= n_params[:kind]
      n_params = n_params.merge(kind: global_kind, read: true)
      Notification.create(n_params)
    end

    def cluster_program_people(cluster_program, *omissions)
      people = cluster_program.all_current_people
      lpf = cluster_program.get_lpf.try(:person)
      people << lpf unless lpf.nil?
      omissions.each{ |p| people.delete(p) }
      people
    end

    def cluster_program_event_people(cluster_program, event, user)
      people = event.people
      people.delete(user)
      people += cluster_program_people(cluster_program, user)
      people.uniq!
      people
    end

    def activity_name(activity)
      activity.is_a?(TranslationActivity) ?
          activity.t_names :
          activity.name
    end
  end
end
