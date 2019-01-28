class Api::ClustersController < ApplicationController
  def create
    authorize! :create, Cluster
    @cluster = Cluster.create!(cluster_params)
    render :show
  end

  def index
    @clusters = Cluster.all
  end

  def show
    @cluster = Cluster.find(params[:id])
  end

  def dashboard
    @cluster = Cluster.find params[:id]
  end

  def search
    @clusters = Cluster.basic_search(params[:q])
  end

  def update
    @cluster = Cluster.find(params[:id])
    authorize! :update, @cluster
    @cluster.update(cluster_params)
    render :show
  end

  def destroy
    @cluster = Cluster.find(params[:id])
    authorize! :destroy, @cluster
    @cluster.destroy!
    response_ok
  end

  private

  def cluster_params
    params.require(:cluster).permit(:name, language_ids: [])
  end
end