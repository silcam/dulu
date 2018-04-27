class Api::OrganizationsController < ApplicationController
  def index

  end

  def show

  end

  def update

  end

  def search
    @organizations = Organization.simple_search(params[:q])
  end
end