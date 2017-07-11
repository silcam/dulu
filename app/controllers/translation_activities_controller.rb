class TranslationActivitiesController < ApplicationController

  def show
    @translation_activity = TranslationActivity.find(params[:id])
    @program = @translation_activity.program
  end
end
