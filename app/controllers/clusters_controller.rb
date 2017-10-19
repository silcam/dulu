class ClustersController < ApplicationController

  before_action :authorize, except: [:index, :show]

  def index
    @clusters = Cluster.all.includes(:languages)
    @cluster = Cluster.new
  end

  def show
    @cluster = Cluster.find params[:id]
  end

  def create
    @cluster = Cluster.new cluster_params
    if @cluster.save
      redirect_to cluster_path @cluster
    else
      @clusters = Cluster.all.includes(:languages)
      render :index
    end
  end

  def edit
    @cluster = Cluster.find params[:id]
  end

  def update
    @cluster = Cluster.find params[:id]
    language = Language.find params[:cluster][:language_id]
    @cluster.languages << language
    redirect_to cluster_path @cluster
  end

  private

  def cluster_params
    params.require(:cluster).permit(:name)
  end

  def authorize
    authorize! :create, Cluster
  end

end
