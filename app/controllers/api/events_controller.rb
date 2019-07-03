class Api::EventsController < ApplicationController
  def index
    event_src = get_event_src
    @events = event_src.for_period(params[:start_year], params[:start_month], params[:end_year], params[:end_month])
    @start_year = params[:start_year].to_i
    if (@events.count == 0) 
      @events = event_src.for_period(nil, nil, params[:end_year], params[:end_month])
      @start_year = nil
    end
  end

  def find
    @events = Event.for_month(params[:year], params[:month]).reverse
  end

  def show
    @event = Event.find(params[:id])
  end
  
  def create
    authorize! :create, Event
    @event = Event.new event_params
    @event.creator = current_user
    @event.workshop = Workshop.find(params[:event][:workshop_id]) if params[:event][:workshop_id]
    @event.save!
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
  end

  private

  def get_event_src
    if params[:language_id]
      return Language.find(params[:language_id]).all_events
    elsif params[:person_id]
      return Person.find(params[:person_id]).events
    else
      return Event
    end
  end

  def event_params
    return params
            .require(:event)
            .permit(
                :name, :domain, :note, :start_date, :end_date,
                :category, :subcategory,
                language_ids: [], cluster_ids: [], 
                event_participants_attributes: [
                  :id, :person_id, :_destroy, roles: []
                ]
              )
  end
end