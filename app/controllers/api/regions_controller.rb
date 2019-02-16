class Api::RegionsController < ApplicationController
  def create
    authorize! :create, Lpf
    @region = Lpf.create!(region_params)
    render :show
  end

  def index
    @regions = Lpf.all
  end

  def show
    @region = Lpf.find(params[:id])
  end

  def update
    @region = Lpf.find(params[:id])
    old_language_ids = @region.language_ids
    old_cluster_ids = @region.cluster_ids
    authorize! :update, @region
    @region.update(region_params)
    @old_languages = Language.where(id: old_language_ids)
    @old_clusters = Cluster.where(id: old_cluster_ids)
    render :show
  end

  def destroy
    @region = Lpf.find(params[:id])
    authorize! :destroy, @region
    @region.destroy!
    response_ok
  end

  private

  def region_params
    params.require(:region).permit(:name, :person_id, cluster_ids: [], language_ids: [])
  end
end
