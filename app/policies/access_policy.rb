class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :site_admin, proc { |u| u.has_role(:role_site_admin) } do
      can [:edit_roles, :grant_admin], Person
      can :login_as_others, Person
      can :read, Audited::Audit
    end

    role :program_admin, proc { |u| u.has_role(:role_program_admin)} do
      can [:create_activity, :manage_participants, :manage_surveys], Program
      can :manage_participants, Cluster
      can :update_activity, Activity
      can :manage, Organization
      can :manage, Language
      can :manage, Event
      can :manage, Publication
      can :manage, DomainUpdate
      can :manage, SurveyCompletion
    end

    role :program_supervisor, proc { |u| u.has_role(:role_program_supervisor) } do
      can [:create, :read, :update], Person
      can [:edit_roles], Person do |person, user|
        person != user
      end

      can [:manage_participants], Program do |program, user|
        program.all_current_people.include? user
      end

      can [:manage_participants], Cluster do |cluster, user|
        cluster.all_current_people.include? user
      end

      can [:create_activity, :manage_surveys], Program do |program, user|
        program.all_current_people.include? user
      end

      can :manage, Language do |language, user|
        language.program.all_current_people.include? user
      end

      can :update_activity, Activity do |activity, user|
        activity.program.all_current_people.include? user
      end

      can [:update, :destroy], Event do |event, user|
        event.associated_with? user
      end

      can :create, Event

      can :manage, Publication do |pub, user|
        pub.program.all_current_people.include? user
      end

      can :manage, DomainUpdate do |domain_update, user|
        domain_update.program.all_current_people.include? user
      end

      can :manage, Cluster
    end

    role :program_responsable, proc { |u| u.has_role(:role_program_responsable) } do
      can [:create_activity, :manage_surveys], Program do |program, user|
        program.all_current_people.include? user
      end

      can :manage, Language do |language, user|
        language.program.all_current_people.include? user
      end

      can :update_activity, Activity do |activity, user|
        activity.program.all_current_people.include? user
      end

      can [:update, :destroy], Event do |event, user|
        event.associated_with? user
      end

      can :create, Event

      can :manage, Publication do |pub, user|
        pub.program.all_current_people.include? user
      end

      can :manage, DomainUpdate do |domain_update, user|
        domain_update.program.all_current_people.include? user
      end
      
      can :manage, Cluster

      can [:read, :update], Person do |person, user|
        person == user
      end
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
    end
  end
end