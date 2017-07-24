class LanguagesController < ApplicationController
  def index
    if params[:region]
      @languages = Language.where(cameroon_region_id: params[:region]).order('name').includes(:language_status, :country, :cameroon_region)
    elsif params[:country]
      @languages = Language.where(country_id: params[:country]).order('name').includes(:language_status, :country, :cameroon_region)
    else
      @languages = Language.all.order('name').includes(:language_status, :country, :cameroon_region)
    end
  end

  def show
    @language = Language.find params[:id]
    @program = @language.program
  end

  def create
    # Create - create a corresponding program
  end

end
