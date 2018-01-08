class ParticipantsController < ApplicationController

  before_action :set_participant, only: [:edit, :update, :finish, :show, :add_update, :remove_update]
  before_action :set_cluster_program, only: [:index, :new, :create]
  before_action :authorize_user, only: [:new, :edit, :create, :update, :finish, :add_update, :remove_update]

  def index
  end

  def new
    @participant = @cluster_program.participants.new
    if session[:referred_by_params] && session[:referred_by_params]['person_id']
      @participant.person_id = session[:referred_by_params]['person_id']
      session.delete :referred_by_params
    end
  end

  def edit

  end

  def create
    @participant = @cluster_program.participants.new(participant_params)
    if @participant.save
      @participant.associate_activities(params[:assoc_activities])
      redirect_to @participant
    else
      render 'new'
    end
  end

  def show

  end

  def update
    if @participant.update participant_params
      @participant.associate_activities params[:assoc_activities]
      redirect_to @participant
    else
      render params[:this_action]
    end
  end

  def finish

  end

  def add_update
    if params[:role]
      @participant.add_role(params[:role]) if @participant.person.has_role?(params[:role])
    elsif params[:activity_id]
      @participant.activities << Activity.find(params[:activity_id])
    end
    redirect_to @participant
  end

  def remove_update
    if params[:role]
      @participant.remove_role(params[:role])
    elsif params[:activity_id]
      @participant.activities.delete(params[:activity_id])
    end
    redirect_to @participant
  end

  private

  def participant_params
    assemble_dates params, :participant, :start_date, :end_date
    params.require(:participant).permit(:person_id, :program_role_id, :start_date, :end_date)
  end

  def set_cluster_program
    @cluster_program = params[:program_id] ?
                           Program.find(params[:program_id]) :
                           Cluster.find(params[:cluster_id])
  end

  def set_participant
    @participant = Participant.find params[:id]
    @cluster_program = @participant.cluster_program
  end

  def authorize_user
    authorize! :manage_participants, @cluster_program
  end
end
