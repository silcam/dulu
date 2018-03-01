class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :site_admin, proc{ |u| u.has_role?(:DuluAdmin) } do
      can [:grant_admin, :login_as_others, :destroy], Person
      can :destroy, Participant
      can :read, Audited::Audit
    end

    role :supervisor, proc{ |u| u.has_role_among?(Role::SUPERVISOR_ROLES) } do
      can [:grant_login], Person
      can [:create_activity, :manage_participants, :manage_surveys, :update_activities], Program
      can :manage, Cluster # :manage cannot be part of an array
      can :manage_participants, Cluster
      can :manage, Activity
      can :manage, Organization
      can :manage, Language
      can :manage, Event
      can :manage, Publication
      can :create, DomainUpdate
      can :manage, SurveyCompletion
    end

    part_roles = Role::SUPERVISOR_ROLES + Role::PARTICIPANT_ROLES
    role :participant, proc{ |u| u.has_role_among? part_roles } do
      can [:create, :read, :update], Person

      can [:manage_participants, :create_activity, :manage_surveys, :update_activities], Program do |program, user|
        program.all_current_people.include? user
      end

      can [:manage_participants], Cluster do |cluster, user|
        cluster.all_current_people.include? user
      end

      can :manage, Language do |language, user|
        language.program.all_current_people.include? user
      end

      can [:update, :destroy], Activity do |activity, user|
        activity.program.all_current_people.include? user
      end

      can [:update, :destroy], Event do |event, user|
        event.associated_with? user
      end

      can :create, Event

      can :manage, Publication do |pub, user|
        pub.program.all_current_people.include? user
      end

      can :create, DomainUpdate do |domain_update, user|
        domain_update.program.all_current_people.include? user
      end

      can [:update, :destroy], DomainUpdate do |domain_update, user|
        domain_update.author == user
      end
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
    end
  end
end