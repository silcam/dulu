class StagesController < ApplicationController
  
  def new
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    @stage = Stage.new_for @translation_activity
  end

  def create
    @translation_activity = TranslationActivity.find(params[:translation_activity_id])
    @stage = @translation_activity.stages.create(stage_params)
    unless @stage.new_record?
      respond_to do |format|
        format.js
        format.html { redirect_to(@translation_activity.program) }
      end
    else
      respond_to do |format|
        format.js { render 'display_errors' }
        format.html { render 'new' }
      end
    end
  end

  def update
    @stage = Stage.find(params[:id])
    respond_to do |format|
      if @stage.update(stage_params)
        format.js
      else
        format.js { render 'display_errors'}
      end
    end
  end

  def destroy
    @stage = Stage.find(params[:id])
    @stage.destroy
    respond_to do |format|
      format.js
      format.html { redirect_to(@stage.translation_activity) }
    end
  end

  private
    def stage_params
      params.require(:stage).permit(:stage_name_id, :start_date)
    end

end
