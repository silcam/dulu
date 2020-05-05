# frozen_string_literal: true

class Api::EventsController < ApplicationController
  def index
    event_src = get_event_src
    @events = event_src.for_period(params[:start_year], params[:start_month], params[:end_year], params[:end_month])
    @start_year = params[:start_year].to_i
    if @events.count.zero?
      @events = event_src.for_period(nil, nil, params[:end_year], params[:end_month])
      @start_year = nil
    end
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

  def search
    @events = Event.search(params[:q])
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
      Language.find(params[:language_id]).all_events
    elsif params[:person_id]
      Person.find(params[:person_id]).events
    else
      Event
    end
  end

  def event_params
    base_params = params
                  .require(:event)
                  .permit(
                    :name, :domain, :note, :start_date, :end_date,
                    :category, :subcategory, :event_location_id,
                    dockets_attributes: %i[
                      id series_event_id event_id _destroy
                    ],
                    language_ids: [], cluster_ids: [],
                    event_participants_attributes: [
                      :id, :person_id, :_destroy, roles: []
                    ]
                  )
    if params[:event][:new_event_location]
      event_location = EventLocation.create(name: params[:event][:new_event_location])
      base_params[:event_location] = event_location
    end
    base_params
  end
end
