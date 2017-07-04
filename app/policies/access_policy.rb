class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :admin, proc { |u| u.is_admin? } do
      can [:change_role, :grant_admin], Person

      can [:create_activity, :manage_participants], Program

      can :update_activity, Activity

      can :manage, Organization
    end

    role :program_supervisor, proc { |u| u.is_program_supervisor? } do
      can [:create, :read, :update], Person
      can [:change_role], Person do |person, user|
        person != user
      end

      can [:manage_participants], Program do |program, user|
        program.current_people.include? user
      end
    end

    role :program_responsable, proc { |u| u.is_program_responsable? } do
      can [:create_activity], Program do |program, user|
        program.current_people.include? user
      end

      can :update_activity, Activity do |activity, user|
        activity.program.current_people.include? user
      end
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
    end
  end
end