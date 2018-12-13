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

  def update
    @event = Event.find(params[:id])
    authorize! :update, @event
    @event.update(event_params)
    render :show
  end

  def destroy
    @event = Event.find(params[:id])
    authorize! :destroy, @event
    @event.destroy!
    response_ok
  end

  private

  def event_params
    return params
            .require(:event)
            .permit(
                :name, :domain, :note, :start_date, :end_date, 
                program_ids: [], cluster_ids: [], 
                event_participants_attributes: [
                  :id, :person_id, :_destroy, roles: []
                ]
              )
  end
end