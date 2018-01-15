class StagesController < ApplicationController
  before_action :set_stage, only: [:update, :destroy]
  before_action :set_activity, only: [:new, :create]
  before_action :authorize_user
  
  # def new
  #   @stage = Stage.new_for @translation_activity
  # end

  def create
    @stage = @activity.stages.create(stage_params.merge(kind: @activity.kind))
    unless @stage.new_record?
      respond_to do |format|
        format.js
        format.html { redirect_to(@activity.program) }
      end
    else
      respond_to do |format|
        format.js { render 'display_errors' }
        format.html { render 'new' }
      end
    end
  end

  def update
    respond_to do |format|
      if @stage.update(stage_params)
        format.js
      else
        format.js { render 'display_errors'}
      end
    end
  end

  def destroy
    @stage.destroy
    respond_to do |format|
      if @stage.destroyed?
        format.js
        format.html { redirect_to(@stage.activity) }
      else
        @error = "Unable to delete this stage from the history."
        format.js { render 'shared/error_popup' }
        format.html { redirect_to(@stage.activity)}
      end
    end
  end

  private

  def stage_params
    assemble_dates params, :stage, :start_date
    params.require(:stage).permit(:name, :start_date)
  end

  def set_stage
    @stage = Stage.find params[:id]
    @activity = @stage.activity
  end

  def set_activity
    @activity = Activity.find params[:activity_id]
  end

  def authorize_user
    authorize! :update_activity, @activity
  end
end
