# frozen_string_literal: true

class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :site_admin, proc { |u| u.has_role?(:DuluAdmin) } do
      can %i[grant_admin login_as_others destroy], Person
      can :destroy, Participant
      can :read, Audited::Audit
      can :manage, Organization
      can %i[manage_participants create update destroy], Cluster
      can :manage, Region
    end

    role :supervisor, proc { |u| u.has_role_among?(Role::SUPERVISOR_ROLES) } do
      can [:grant_login], Person
      can %i[create_activity manage_participants manage_surveys update_activities], Language
      can %i[manage_participants create update], Cluster
      can :manage, Activity
      can :manage, Language
      can :manage, Event
      can :manage, Publication
      can :create, DomainUpdate
      can :manage, SurveyCompletion
      can %i[create update], Region
    end

    part_roles = Role::SUPERVISOR_ROLES + Role::PARTICIPANT_ROLES
    role :participant, proc { |u| u.has_role_among? part_roles } do
      can %i[create read update], Person

      can %i[create read update], Organization

      can [:manage_participants, :create_activity, :manage_surveys, :update_activities, :update], Language do |language, user|
        language.all_current_people.include? user
      end

      can [:manage_participants], Cluster do |cluster, user|
        cluster.all_current_people.include? user
      end

      can [:update, :destroy], Activity do |activity, user|
        activity.language.all_current_people.include? user
      end

      can [:update, :destroy], Event do |event, user|
        event.associated_with? user
      end

      can :create, Event

      can :manage, Publication do |pub, user|
        pub.language.all_current_people.include? user
      end

      can :create, DomainUpdate do |domain_update, user|
        domain_update.language.all_current_people.include? user
      end

      can [:update, :destroy], DomainUpdate do |domain_update, user|
        domain_update.author == user
      end
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
      
      can [:update, :destroy], Note do |note, user|
        note.person == user
      end
    end
  end
end
