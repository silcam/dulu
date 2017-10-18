class ClustersController < ApplicationController

  def index
    @clusters = Cluster.all.includes(:languages)
  end

  def new
    @cluster = Cluster.new
  end

  def create
    @cluster = Cluster.new cluster_params
    if @cluster.save
      redirect_to clusters_path
    else
      render :new
    end
  end

  def edit
    @cluster = Cluster.find params[:id]
  end

  def update
    @cluster = Cluster.find params[:id]
    language = Language.find params[:cluster][:language_id]
    @cluster.languages << language
    redirect_to clusters_path
  end

  private

  def cluster_params
    params.require(:cluster).permit(:name)
  end

end
