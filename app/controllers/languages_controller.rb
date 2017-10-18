class LanguagesController < ApplicationController
  before_action :set_language, only: [:show, :edit, :update]

  def index
    if params[:region]
      @languages = Language.where(cameroon_region_id: params[:region]).std_includes
    elsif params[:country]
      @languages = Language.where(country_id: params[:country]).std_includes
    elsif params[:cluster]
      @languages = Cluster.find(params[:cluster]).languages
    else
      @languages = Language.std_includes
    end
  end

  def show
  end

  def create
    @dialect = Language.new language_params
    if @dialect.save
      program = Program.create!(language: @dialect)
      redirect_to dashboard_program_path(program)
    else
      @language = Language.find params[:language][:parent_id]
      @program = @language.program
      render 'edit'
    end
  end

  def edit
    authorize! :update, @language
    @dialect = Language.new(parent: @language, country: @language.country,
                            cameroon_region: @language.cameroon_region)
  end

  def update
    authorize! :update, @language
    if(@language.alt_names_array.include? params[:language_name])
      @language.update_name params[:language_name]
    end
    redirect_to language_path(@language)
  end

  private

  def language_params
    params.require(:language).permit(:parent_id, :country_id, :cameroon_region_id, :name)
  end

  def set_language
    @language = Language.find(params[:id])
    @program = @language.program
  end

end
