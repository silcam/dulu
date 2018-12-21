class Api::LanguagesController < ApplicationController
  def index
    @programs = Program.all
  end

  def show
    @program = Program.find(params[:id])
  end

  def search
    @programs = Language.search(params[:q])
  end

  def get_event
    language = Program.find(params[:id])
    event = Event.find(params[:event_id])
    all_events = language.events.to_a
    @events = all_events.slice(0, all_events.index(event)+1)
  end

  # TODO-Fix: Transitional necessity - this one returns language.id, not program.id
  def lang_search
    @programs = Language.search(params[:q])
  end
end