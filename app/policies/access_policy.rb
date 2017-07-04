class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :admin, proc { |u| u.is_admin? } do
      can [:change_role, :grant_admin], Person
      can :update_activity
      can :manage, Organization
    end

    role :program_supervisor, proc { |u| u.is_program_supervisor? } do
      can [:create, :read, :update], Person
      can [:change_role], Person do |person, user|
        person != user
      end
    end

    role :program_responsable, proc { |u| u.is_program_responsable? } do
      can :update_activity, Activity do |activity, user|
        activity.program.current_people.incude? user
      end
    end

    role :user do
      can [:read, :update], Person do |person, user|
        person == user
      end
    end
  end
end