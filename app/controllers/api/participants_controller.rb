class Api::ParticipantsController < ApplicationController
  def create
    @participant = Participant.new(participant_params)
    authorize! :manage_participants, @participant.cluster_program
    @participant.save!
    render :show
  end

  private

  def participant_params
    params.require(:participant).permit(:person_id, :program_id, :cluster_id, :start_date, :end_date, :roles)
  end
end
