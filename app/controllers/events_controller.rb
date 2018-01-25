class EventsController < ApplicationController

  def index
    if params[:program_id]
      @program = Program.find(params[:program_id])
      render 'index_for_program'
    else
      render 'index'
    end
  end

  def new
    authorize! :create, Event

    if params[:program_id]
      @program = Program.find params[:program_id]
      @event = @program.events.build
    else
      @event = Event.new
    end

    if params[:workshop]
      @workshop = Workshop.find(params[:workshop])
      @workshop.set_event_defaults(@event)
      authorize! :update_activity, @workshop.linguistic_activity
    end
  end

  def create
    authorize! :create, Event
    @event = Event.new(event_params)
    @program = Program.find(params[:program_id]) if params[:program_id]
    workshop = Workshop.find_by id: params[:workshop_id]
    if @event.save
      @event.programs << @program if @program
      if workshop
        @event.workshop = workshop
        follow_redirect activity_path(workshop.linguistic_activity)
      else
        redirect_to (@program ? program_event_path(@program, @event) : event_path(@event))
      end
    else
      render 'new'
    end
  end

  def show
    @event = Event.find params[:id]
    @program = Program.find params[:program_id] if params[:program_id]
  end

  def edit
    @event = Event.find params[:id]
    authorize! :update, @event
    @program = Program.find(params[:program_id]) if params[:program_id]
  end

  def update
    @event = Event.find params[:id]
    authorize! :update, @event
    if @event.update(event_params)
      follow_redirect events_path
    else
      render 'edit'
    end
  end

  def add_update
    @event = Event.find params[:id]
    authorize! :update, @event
    @event.clusters << Cluster.find(params[:event_cluster]) if params[:event_cluster]
    @event.programs << Program.find(params[:event_program]) if params[:event_program]
    EventParticipant.build(@event, params[:event_person]) if params[:event_person]

    redirect_to (params[:program_id] ?
                     program_event_path(params[:program_id], @event) :
                     event_path(@event)
                )
  end

  def remove_update
    @event = Event.find params[:id]
    authorize! :update, @event
    @event.clusters.delete(params[:cluster_id]) if params[:cluster_id]
    @event.programs.delete(params[:remove_program]) if params[:remove_program]
    EventParticipant.find(params[:remove_participant]).delete if params[:remove_participant]
    redirect_to (params[:program_id] ?
                     program_event_path(params[:program_id], @event) :
                     event_path(@event)
                )
  end

  def destroy
    @event = Event.find params[:id]
    authorize! :destroy, @event
    @event.destroy
    if params[:program_id]
      redirect_to program_events_path(params[:program_id])
    else
      redirect_to events_path
    end
  end

  private

  def event_params
    assemble_dates params, 'event', 'start_date', 'end_date'
    params[:event][:creator_id] = current_user.id
    params.require(:event).permit(:domain, :name, :start_date, :end_date, :note, :creator_id)
  end
end
