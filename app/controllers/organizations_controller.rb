class OrganizationsController < ApplicationController
  before_action :set_organization, only: [:edit, :update]
  before_action :authorize_user, only: [:new, :create, :edit, :update]

  def index
    @organizations = Organization.all
  end

  def show
    @organization = Organization.find(params[:id])
    render :index
  end

  # def new
  #   @organization = Organization.new
  # end
  
  # def create
  #   @organization = Organization.new(org_params)
  #   if @organization.save
  #     redirect_to organizations_path
  #   else
  #     render 'new'
  #   end
  # end

  # private

  # def org_params
  #   params.require(:organization).permit(:name, :abbreviation)
  # end

  # def set_organization
  #   @organization = Organization.find params[:id]
  # end

  # def authorize_user
  #   authorize! :create, Organization
  # end
end
