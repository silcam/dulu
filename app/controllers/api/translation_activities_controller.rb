class Api::TranslationActivitiesController < ApplicationController

  def index
    @program = Program.find(params[:program_id])
    @activities = @program.translation_activities.order(:bible_book_id)
  end
end