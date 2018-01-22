class ActivitiesController < ApplicationController
  before_action :set_activity, only: [:show, :edit, :update, :update_workshops]
  before_action :set_program, only: [:index, :new, :create]

  def index
    @program = Program.find params[:program_id]
  end

  def new
    authorize! :create_activity, @program
    @activity = @program.activities.new
  end

  def create
    authorize! :create_activity, @program
    participants = Participant.where(id: params[:activity][:participant_ids])
    @activity = Activity.subclass_from_text(params[:activity][:type]).build(params[:activity], @program, participants)
    if @activity.persisted?
      redirect_to dashboard_program_path @program
    else
      render :new
    end
  end

  def show
  end

  def edit
    authorize! :update_activity, @activity
  end

  def update
    authorize! :update_activity, @activity
    @activity.update activity_params
    redirect_to activity_path(@activity)
  end

  def update_workshops
    authorize! :update_activity, @activity
    @activity.update_workshops(params)
    redirect_to activity_path(@activity)
  end

  private

  def set_program
    @program = Program.find params[:program_id]
  end

  def set_activity
    @activity = Activity.find(params[:id])
    @program = @activity.program
  end

  def activity_params
    params.require(:activity).permit(:note, :title)
  end
end
