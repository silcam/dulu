class ActivitiesController < ApplicationController
  # before_action :set_activity, only: []
  before_action :set_program
  before_action :authorize_user, only: [:new, :create]

  def index
    @program = Program.find params[:program_id]
  end

  def new
    @activity = @program.activities.new
  end

  def create
    Activity.subclass_from_text(params[:activity][:type]).build_all(@program, params[:activity])
    redirect_to dashboard_program_path @program
  end

  private

  def set_program
    @program = Program.find params[:program_id]
  end

  def authorize_user
    authorize! :create_activity, @program
  end
end
