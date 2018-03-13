class LpfsController < ApplicationController

  before_action :set_lpf, only: [:show, :edit, :update, :add_update, :remove_update, :destroy]

  def index
    @lpfs = Lpf.all
  end

  def new
    authorize! :create, Lpf
    @lpf = Lpf.new
  end

  def create
    authorize! :create, Lpf
    Lpf.create lpf_params
    redirect_to lpfs_path
  end

  def show

  end

  def edit
    authorize! :update, @lpf

  end

  def update
    authorize! :update, @lpf
    @lpf.update lpf_params
    redirect_to @lpf
  end

  def add_update
    authorize! :update, @lpf
    @lpf.clusters << Cluster.find(params[:cluster_id]) if params[:cluster_id]
    @lpf.programs << Program.find(params[:program_id]) if params[:program_id]
    redirect_to @lpf
  end

  def remove_update
    authorize! :update, @lpf
    @lpf.clusters.delete Cluster.find(params[:cluster_id]) if params[:cluster_id]
    # @lpf.programs.delete Program.find(params[:program_id]) if params[:program_id] # Rails bug - causes PG exception
    Program.find(params[:program_id]).update(lpf: nil) if params[:program_id]
    redirect_to @lpf
  end

  def destroy
    authorize! :destroy, @lpf

  end

  private

  def lpf_params
    params.require(:lpf).permit(:name, :person_id)
  end

  def set_lpf
    @lpf = Lpf.find params[:id]
  end

end
