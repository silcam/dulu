class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :site_admin, proc { |u| u.has_role(:role_site_admin) } do
      can [:change_role, :grant_admin], Person
    end

    role :program_admin, proc { |u| u.has_role(:role_program_admin)} do
      can [:create_activity, :manage_participants], Program
      can :update_activity, Activity
      can :manage, Organization
      can :manage, Language
    end

    role :program_supervisor, proc { |u| u.has_role(:role_program_supervisor) } do
      can [:create, :read, :update], Person
      can [:change_role], Person do |person, user|
        person != user
      end

      can [:manage_participants], Program do |program, user|
        program.current_people.include? user
      end

      can :manage, Language do |language, user|
        language.program.current_people.include? user
      end

      can :manage, Event do |event, user|

      end
    end

    role :program_responsable, proc { |u| u.has_role(:role_program_responsable) } do
      can [:create_activity], Program do |program, user|
        program.current_people.include? user
      end

      can :update_activity, Activity do |activity, user|
        activity.program.current_people.include? user
      end

      can [:update, :delete], Event do |event, user|
        event.updateable_by? user
      end
      can :create, Event
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
    end
  end
end