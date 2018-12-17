class Api::ParticipantsController < ApplicationController
  def create
    @participant = Participant.new(participant_params)
    authorize! :manage_participants, @participant.cluster_program
    @participant.save!
    render :show
  end

  def update
    @participant = Participant.find(params[:id])
    authorize! :manage_participants, @participant.cluster_program
    @participant.update(participant_params)
    render :show
  end

  def destroy
    @participant = Participant.find(params[:id])
    authorize! :manage_participants, @participant.cluster_program
    @participant.destroy!
    response_ok
  end

  private

  def participant_params
    params.require(:participant).permit(:person_id, :program_id, :cluster_id, :start_date, :end_date, roles: [])
  end
end
