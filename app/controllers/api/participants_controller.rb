class Api::ParticipantsController < ApplicationController
  def index
    @cluster_language = params[:language_id] ?
      Language.find(params[:language_id]) :
      Cluster.find(params[:cluster_id])
    @participants = @cluster_language.all_participants
  end

  def create
    @participant = Participant.new(participant_params)
    authorize! :manage_participants, @participant.cluster_language
    @participant.save!
    render :show
    if @participant.language
      Notification.new_language_participant(current_user, @participant)
    else
      Notification.new_cluster_participant(current_user, @participant)
    end
  end

  def show
    @participant = Participant.find(params[:id])
  end

  def update
    @participant = Participant.find(params[:id])
    authorize! :manage_participants, @participant.cluster_language
    @participant.update(participant_params)
    render :show
  end

  def destroy
    @participant = Participant.find(params[:id])
    authorize! :manage_participants, @participant.cluster_language
    @participant.destroy!
    response_ok
  end

  private

  def participant_params
    params.require(:participant).permit(:person_id, :language_id, :cluster_id, :start_date, :end_date, roles: [])
  end
end
