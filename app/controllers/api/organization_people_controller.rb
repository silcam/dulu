class Api::OrganizationPeopleController < ApplicationController
  def create
    set_person_and_org
    authorize! :update, @person
    create_params = op_params.merge(person: @person, organization: @org)
    @org_person = OrganizationPerson.create(create_params)
  end

  def update
    @org_person = OrganizationPerson.find(params[:id])
    authorize! :update, @org_person.person
    @org_person.update(op_params)
  end

  def destroy
    @org_person = OrganizationPerson.find(params[:id])
    authorize! :update, @org_person.person
    @org_person.destroy
    head :no_content, status: :ok
  end

  private

  def op_params
    params.require(:organization_person).permit(:position,
                                                :start_date,
                                                :end_date)
  end

  def set_person_and_org
    @person = Person.find(params[:organization_person][:person_id])
    @org = Organization.find(params[:organization_person][:organization_id])
  end
end