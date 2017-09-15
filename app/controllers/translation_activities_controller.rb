class TranslationActivitiesController < ApplicationController

  def show
    @translation_activity = TranslationActivity.find(params[:id])
    @program = @translation_activity.program
  end

  def update
    @translation_activity = TranslationActivity.find params[:id]
    authorize! :update_activity, @translation_activity
    @translation_activity.update ta_params
    redirect_to @translation_activity
  end

  private

  def ta_params
    params.require(:translation_activity).permit(:note)
  end
end
