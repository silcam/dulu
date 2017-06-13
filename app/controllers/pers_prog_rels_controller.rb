class PersProgRelsController < ApplicationController

  def index
    @program = Program.find params[:program_id]
  end

  def new
    @program = Program.find params[:program_id]
    @pers_prog_rel = @program.pers_prog_rels.new
    if session[:referred_by_params] && session[:referred_by_params]['person_id']
      @pers_prog_rel.person_id = session[:referred_by_params]['person_id']
      session.delete :referred_by_params
    end
  end

  def edit
    @pers_prog_rel = PersProgRel.find params[:id]
    @program = @pers_prog_rel.program
  end

  def create
    @program = Program.find(params[:program_id])
    @pers_prog_rel = @program.pers_prog_rels.new(pers_prog_rel_params)
    if @pers_prog_rel.save
      @pers_prog_rel.associate_activities(params[:assoc_activities])
      redirect_to program_pers_prog_rels_path @program
    else
      render 'new'
    end
  end

  def update
    @pers_prog_rel = PersProgRel.find(params[:id])
    if @pers_prog_rel.update pers_prog_rel_params
      @pers_prog_rel.associate_activities params[:assoc_activities]
      redirect_to program_pers_prog_rels_path @pers_prog_rel.program
    else
      render 'edit'
    end
  end

  private

  def pers_prog_rel_params
    assemble_dates params, :pers_prog_rel, :start_date
    params.require(:pers_prog_rel).permit(:person_id, :program_role_id, :start_date, :end_date)
  end
end
