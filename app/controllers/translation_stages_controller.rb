class TranslationStagesController < ApplicationController
  
  def new
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    @translation_stage = TranslationStage.new_for @translation_activity
  end

  def create
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    @translation_stage = @translation_activity.translation_stages.create(translation_stage_params)
    unless @translation_stage.new_record?
      respond_to do |format|
        format.js
        format.html { redirect_to(@translation_activity.program) }
      end
    else
      respond_to do |format|
        format.js { render 'create_with_errors' }
        format.html { render 'new' }
      end
    end
  end

  def update
    @stage = TranslationStage.find(params[:id])
    @stage.update(translation_stage_params)
    respond_to do |format|
      format.html { redirect_to(@translation_activity) }
      format.js
    end
  end

  def destroy
    @stage = TranslationStage.find(params[:id])
    @stage.destroy
    respond_to do |format|
      format.js
      format.html { redirect_to(@stage.translation_activity) }
    end
  end

  private
    def translation_stage_params
      params.require(:translation_stage).permit(:stage_name_id, :start_date)
    end

end
