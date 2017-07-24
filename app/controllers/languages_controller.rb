class LanguagesController < ApplicationController
  before_action :set_language, only: [:show, :edit, :update]

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
  end

  def create
    # Create - create a corresponding program
  end

  def edit
  end

  def update
    authorize! :update, @language
    if(@language.alt_names_array.include? params[:language_name])
      @language.update_name params[:language_name]
    end
    redirect_to language_path(@language)
  end

  private

  def set_language
    @language = Language.find(params[:id])
    @program = @language.program
  end

end
