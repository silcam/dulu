class WorkshopsController < ApplicationController

  before_action :set_workshop

  def complete
    authorize! :update, @activity
    @workshop.complete(workshop_params)
    render json: @workshop.to_hash.merge(action: 'workshops#complete')
    Notification.generate(:workshop_complete, current_user, @workshop)
  end

  private

  def workshop_params
    if params[:workshop]
      assemble_dates params, 'workshop', 'date'
      params.require(:workshop).permit(:date)
    else
      {}
    end
  end

  def set_workshop
    @workshop = Workshop.find params[:id]
    @activity = @workshop.linguistic_activity
  end
end
