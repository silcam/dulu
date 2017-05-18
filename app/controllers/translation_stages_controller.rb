class TranslationStagesController < ApplicationController
  respond_to :html, :js
  
  def new
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    @translation_stage = TranslationStage.new_for @translation_activity
  end

  def create
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    if @translation_activity.translation_stages.create(translation_stage_params)
      redirect_to @translation_activity.program
    else
      render 'new'
    end
  end

  private
    def translation_stage_params
      params.require(:translation_stage).permit(:stage_name_id, :start_date)
    end

end
