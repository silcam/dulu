class OrganizationsController < ApplicationController

  def index
    @organizations = Organization.all.order("name ASC")
  end

  def new
    @organization = Organization.new
  end
  
  def create
    @organization = Organization.new(org_params)
    if @organization.save
      redirect_to organizations_path
    else
      render 'new'
    end
  end

  private
    def org_params
      params.require(:organization).permit(:name, :abbreviation)
    end
end
