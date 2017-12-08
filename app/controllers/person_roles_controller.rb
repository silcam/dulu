class PersonRolesController < ApplicationController

  before_action :set_person

  def create
    role = params[:person_role][:role]
    authorize! :edit_roles, @person
    @person.add_role(role) if Role.is_a_role?(role)
    redirect_to @person
  end

  def finish
    role = params[:id]
    @person.remove_role(role)
    redirect_to @person
  end

  private

  def set_person
    @person = Person.find params[:person_id]
  end

end
