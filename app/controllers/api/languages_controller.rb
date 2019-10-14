class Api::LanguagesController < ApplicationController
  def index
    @languages = Language.all
  end

  def show
    @language = Language.find(params[:id])
  end

  def dashboard
    @language = Language.find(params[:id])
  end

  def dashboard_list
  end

  def search
    @languages = Language.basic_search(params[:q])
  end

  def more_events
    language = Language.find(params[:id])
    @events = language.all_events.limit(16).offset(params[:offset])
  end

  def get_event
    language = Language.find(params[:id])
    event = Event.find(params[:event_id])
    all_events = language.all_events.to_a
    @events = all_events.slice(0, all_events.index(event) + 1)
  end

  def find_language_id
    @language = Language.find_by(program_id: params[:program_id])
    render json: { language_id: @language.id }
  end

  def pubs
    @language = Language.find(params[:id])
  end
end
