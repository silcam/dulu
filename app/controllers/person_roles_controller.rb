class PersonRolesController < ApplicationController

  before_action :set_person

  def create
    role = params[:person_role][:role]
    authorize_add_role role
    @person.add_role(role) if Role.is_a_role?(role)
    redirect_to @person
    Notification.gave_you_role current_user, @person, role
  end

  def finish
    authorize! :update, @person
    role = params[:id]
    @person.remove_role(role)
    redirect_to @person
  end

  private

  def set_person
    @person = Person.find params[:person_id]
  end

  def authorize_add_role(role)
    unless Role.grantable_roles(current_user).include?(role.to_sym)
      raise AccessGranted::AccessDenied
    end
  end
end
