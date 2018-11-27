class Api::TranslationActivitiesController < ApplicationController

  def index
    @program = Program.find(params[:program_id])
    @translation_activities = @program.translation_activities.order(:bible_book_id)
  end

  def create
    @program = Program.find(params[:program_id])
    authorize! :create_activity, @program
    TranslationActivity.create! program: @program, bible_book_id: translation_activity_params[:bible_book_id]
    @translation_activities = @program.translation_activities.order(:bible_book_id)
    render :index
  end

  private

  def translation_activity_params
    return params.require(:translation_activity).permit(:bible_book_id)
  end
end