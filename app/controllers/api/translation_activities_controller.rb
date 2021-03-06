# frozen_string_literal: true

class Api::TranslationActivitiesController < ApplicationController
  def index
    @language = Language.find(params[:language_id])
    @translation_activities = @language.translation_activities.order(:bible_book_id)
  end

  def create
    @language = Language.find(params[:language_id])
    authorize! :create_activity, @language
    @activity = TranslationActivity.create! language: @language, bible_book_id: translation_activity_params[:bible_book_id]
    @translation_activities = @language.translation_activities.order(:bible_book_id)
    render 'api/activities/show'
    Notification.new_activity(current_user, @activity)
  end

  private

  def translation_activity_params
    params.require(:translation_activity).permit(:bible_book_id)
  end
end
