class PersProgRelsController < ApplicationController
  def new
    @program = Program.find params[:program_id]
    @pers_prog_rel = @program.pers_prog_rels.new
    if session[:referred_by_params] && session[:referred_by_params]['person_id']
      @pers_prog_rel.person_id = session[:referred_by_params]['person_id']
      session.delete :referred_by_params
    end
  end

  def create
    @program = Program.find(params[:program_id])
    @pers_prog_rel = @program.pers_prog_rels.new(pers_prog_rel_params)
    if @pers_prog_rel.save
      @pers_prog_rel.associate_activities(params[:assoc_activities])
      redirect_to @program
    else
      render 'new'
    end
  end

  private

  def pers_prog_rel_params
    assemble_dates params, :pers_prog_rel, :start_date
    params.require(:pers_prog_rel).permit(:person_id, :program_role_id, :start_date)
  end
end
