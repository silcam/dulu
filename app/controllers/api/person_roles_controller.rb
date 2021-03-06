# frozen_string_literal: true

class Api::PersonRolesController < ApplicationController
  before_action :set_person

  def create
    role = params[:role]
    authorize_add_role(role)
    @person.add_role(role) if Role.is_a_role?(role)
    Notification.gave_person_role current_user, @person, role
    render 'api/people/show'
  end

  def finish
    authorize! :update, @person
    role = params[:role]
    @person.remove_role(role)
    current_user.reload if current_user == @person # weird edge case
    render 'api/people/show'
  end

  private

  def set_person
    @person = Person.find(params[:person_id])
  end

  def authorize_add_role(role)
    raise AccessGranted::AccessDenied unless Role.grantable_roles(current_user).include?(role.to_sym)
  end
end
