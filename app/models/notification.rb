# frozen_string_literal: true

class Notification < ApplicationRecord
  has_many :person_notifications
  belongs_to :creator, class_name: 'Person'

  default_scope { order(id: :desc) }

  def text(locale = I18n.locale)
    locale.to_sym == :fr ? french : english
  end

  def simple_text(locale = I18n.locale)
    text(locale).gsub(/\[(.+?)\]\(.+?\)/, '\1')
  end

  def html(locale = I18n.locale, route_prefix = '')
    text(locale).gsub(/\[(.+?)\]\((.+?)\)/, "<a href='#{route_prefix}\\2'>\\1</a>")
  end

  class << self
    include ApplicationHelper
    include TranslationHelper

    def new_language_participant(user, participant)
      language = participant.language
      params = t_params(
        'notification.new_language_participant',
        participant_name: participant.full_name, 
        language_name: language.name 
      )
      links = {
        participant_name: participant,
        language_name: language
      }
      channels = NotificationChannel.channels_for(language, participant.domains)
      send_notification(generate(params, links, channels, user))
    end

    def new_cluster_participant(user, participant)
      cluster = participant.cluster
      params = t_params(
        'notification.new_cluster_participant',
        participant_name: participant.full_name, 
        cluster_name: cluster.name
      )
      links = {
        participant_name: participant,
        cluster_name: cluster
      }
      channels = NotificationChannel.channels_for(cluster, participant.domains) 
      send_notification(generate(params, links, channels, user))
    end

    def new_stage(user, stage)
      activity = stage.activity
      language = activity.language
      params = t_params(
        'notification.new_stage',
        language_name: language.name,
        stage_name: t_params(stage.name),
        activity_name: activity_name(activity)
      )
      links = {
        language_name: language,
        activity_name: activity
      }
      channels = NotificationChannel.channels_for(language, activity.domain)  
      send_notification(generate(params, links, channels, user))
    end

    def workshop_complete(user, workshop)
      language = workshop.linguistic_activity.language
      params = t_params(
        'notification.workshop_complete',
        workshop_name: workshop.name,
        language_name: language.name
      )
      links = {
        workshop_name: workshop.linguistic_activity,
        language_name: language
      }
      channels = NotificationChannel.channels_for(language, :Linguistics) 
      send_notification(generate(params, links, channels, user))
    end

    def new_activity(user, activity)
      language = activity.language
      params = t_params(
        'notification.new_activity',
        language_name: language.name,
        activity_name: activity_name(activity)
      )
      links = {
        language_name: language,
        activity_name: activity
      }
      channels = NotificationChannel.channels_for(language, activity.domain)  
      send_notification(generate(params, links, channels, user))
    end

    def updated_person(user, person)
      return if user == person
      
      params = t_params(
        'notification.updated_person',
        person_name: person.full_name
      )
      links = { person_name: person }
      send_notification(generate(params, links, '', user), [person])
    end

    def gave_person_role(user, person, role)
      params = t_params(
        'notification.gave_person_role',
        person_name: person.full_name,
        role_name: {
          key: role
        }
      )
      links = { person_name: person }
      send_notification(generate(params, links, '', user), [person])
    end

    def added_people_to_activity(user, people, activity)
      language = activity.language
      params = t_params(
        'notification.added_people_to_activity',
        person_names: people.map(&:full_name).join(', '),
        activity_name: activity_name(activity),
        language_name: language.name
      )
      links = {
        person_names: people,
        activity_name: activity,
        language_name: language
      }
      channels = NotificationChannel.channels_for(language, activity.domain) 
      send_notification(generate(params, links, channels, user))
    end

    def added_people_to_event(user, event_participants)
      event = event_participants[0].event
      event_people = event_participants.map(&:person)
      params = t_params(
        'notification.added_people_to_event',
        person_names: event_people.map(&:full_name).join(', '),
        event_name: event.name
      )
      links = {
        person_names: event_people,
        event_name: event
      }
      send_notification(generate(params, links, '', user), event.people)
    end

    def new_event_for_language(user, event, language)
      params = t_params(
        'notification.new_event_for_language',
        event_name: event.name,
        language_name: language.name
      )
      links = {
        event_name: event,
        language_name: language
      }
      channels = NotificationChannel.channels_for(language, event.domain)  
      send_notification(generate(params, links, channels, user))
    end

    def added_language_to_event(user, language, event)
      params = t_params(
        'notification.added_language_to_event',
        language_name: language.name,
        event_name: event.name
      )
      links = {
        language_name: language,
        event_name: event
      }
      channels = NotificationChannel.channels_for(language, event.domain) 
      send_notification(generate(params, links, channels, user))
    end

    def added_cluster_to_event(user, cluster, event)
      params = t_params(
        'notification.added_cluster_to_event',
        cluster_name: cluster.name,
        event_name: event.name
      )
      links = {
        cluster_name: cluster,
        event_name: event
      }
      channels = NotificationChannel.channels_for(cluster, event.domain) 
      send_notification(generate(params, links, channels, user))
    end

    private

    def activity_name(activity)
      case activity.type.to_sym
      when :LinguisticActivity
        activity.name
      when :TranslationActivity
        t_params(activity.name)
      when :MediaActivity
        activity.t_name
      else
        throw "Unknown activity type #{activity.type}"
      end
    end

    def text_params(params, links)
      {
        english: t_nested(params, :en) { |subs| linkify_subs(subs, links) },
        french: t_nested(params, :fr) { |subs| linkify_subs(subs, links) }
      }
    end

    def with_user(params, links, user)
      [
        params.merge(subs: params[:subs].merge(user_name: user.full_name)),
        links.merge(user_name: user)
      ]
    end

    def linkify_subs(subs, links)
      subs.merge(links) do |_key, text, paths_or_models|
        if paths_or_models.is_a?(Array)
          texts = text.split(/,\s*/)
          texts
            .zip(paths_or_models)
            .map { |t_p| linkify(t_p[0], t_p[1]) }
            .join(', ')
            .sub(/,([^,]+$)/, ' &\1')
        else
          linkify(text, paths_or_models)
        end
      end
    end

    def linkify(text, path_or_model)
      path = path_or_model.is_a?(String) ? path_or_model : model_path(path_or_model)
      "[#{text}](#{path})"
    end

    def generate(params, links, channels, user)
      create(
        text_params(*with_user(params, links, user)).merge(
          creator: user,
          channels: channels
        )
      )
    end

    def send_notification(notification, people = nil)
      people ||= NotificationChannel.people_for_channels(notification.channels)
      people.uniq.each do |person|
        person_notification = PersonNotification.create(
          person: person,
          notification: notification,
          read: person == notification.creator
        )
        person_notification.email
      end
      notification
    end
    # handle_asynchonously :send_notification
  end
end
