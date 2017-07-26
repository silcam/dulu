class EventsController < ApplicationController

  def index
    if params[:program_id]
      @program = Program.find(params[:program_id])
      # @upcoming_events = @program.upcoming_events
      # @past_events =
    end
  end

  def new
    @program = Program.find params[:program_id]
    @event = @program.events.build
  end

  def create
    @program = Program.find params[:program_id]
    @event = Event.new(prepared_event_params)
    if(@event.save)
      redirect_to dashboard_program_path(@program)
    else
      render 'new'
    end
  end

  private

  def prepared_event_params
    prms = event_params
    prms[:program_ids].uniq!
    prms[:event_participants].collect! do |ep_params|
      EventParticipant.new(ep_params) unless ep_params[:person_id].blank?
    end
    prms[:event_participants].delete_if{|ep| ep.nil?}
    prms
  end

  def event_params
    assemble_dates params, 'event', 'start_date', 'end_date'
    params.require(:event).permit(:kind, :name, :start_date, :end_date,
                                  program_ids: [],
                                  event_participants: [:person_id, :program_role_id])
  end
end
