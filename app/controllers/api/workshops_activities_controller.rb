class Api::WorkshopsActivitiesController < ApplicationController
  def index
    @program = Program.find(params[:program_id])
    @workshops_activities = get_workshops_activities
  end

  def create
    @program = Program.find(params[:program_id])
    authorize! :create_activity, @program
    @program.linguistic_activities.create!(workshops_activity_params)
    @workshops_activities = get_workshops_activities
    render :index
  end

  private

  def workshops_activity_params
    wa_params = params.require(:workshops_activity).permit(:title, {workshops_attributes: [:number, :name] })
    wa_params[:category] = :Workshops
    return wa_params
  end

  def get_workshops_activities
    @program.workshops_activities
  end
end