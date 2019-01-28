class Api::OrganizationsController < ApplicationController
  def index
    @orgs = Organization.all
  end

  def show
    @org = Organization.find(params[:id])
  end

  def create
    authorize! :create, Organization
    @org = Organization.create!(org_params)
    render :show
  end

  def update
    @org = Organization.find(params[:id])
    authorize! :update, @org
    @org.update(org_params)
    @org.reload unless @org.valid?
    render :show
  end

  def destroy
    @org = Organization.find(params[:id])
    authorize! :destroy, @org
    @org.destroy!
    response_ok
  end

  def search
    @organizations = Organization.simple_search(params[:q])
  end

  private

  def org_params
    params.require(:organization).permit(:short_name, 
                                         :long_name, 
                                         :description,
                                         :parent_id,
                                         :country_id)
  end
end