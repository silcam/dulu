class Api::LanguagesController < ApplicationController
  def index
    @programs = Program.all
  end

  def show
    @program = Program.find(params[:id])
  end

  def search
    @programs = Language.search(params[:q])
  end

  # Transitional necessity - this one returns language.id, not program.id
  def lang_search
    @programs = Language.search(params[:q])
  end
end