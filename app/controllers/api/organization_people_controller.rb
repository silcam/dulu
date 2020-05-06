# frozen_string_literal: true

class Api::OrganizationPeopleController < ApplicationController
  def index
    @org_people = Person.find(params[:person_id]).organization_people
  end

  def create
    @person = Person.find(params[:organization_person][:person_id])
    @org = Organization.find(params[:organization_person][:organization_id])
    authorize! :update, @person
    create_params = op_params.merge(person: @person, organization: @org)
    @org_person = OrganizationPerson.create(create_params)
    @org_people = [@org_person]
    render :index
  end

  def update
    @org_person = OrganizationPerson.find(params[:id])
    authorize! :update, @org_person.person
    @org_person.update(op_params)
    @org_people = [@org_person]
    render :index
  end

  def destroy
    @org_person = OrganizationPerson.find(params[:id])
    authorize! :update, @org_person.person
    @org_person.destroy
  end

  private

  def op_params
    params.require(:organization_person).permit(:position,
                                                :start_date,
                                                :end_date)
  end
end
