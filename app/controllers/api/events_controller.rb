class Api::EventsController < ApplicationController
  def find
    @events = Event.for_month(params[:year], params[:month]).reverse
  end

  def show
    @event = Event.find(params[:id])
  end
  
  def create
    authorize! :create, Event
    @event = Event.create! event_params
    render :show
  end

  private

  def event_params
    return params.require(:event).permit(:name, :domain, :start_date, :end_date, program_ids: [], cluster_ids: [])
  end
end