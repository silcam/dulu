# frozen_string_literal: true

class Api::RegionsController < ApplicationController
  def create
    authorize! :create, Region
    @region = Region.create!(region_params)
    @region_updated = true
    render :show
  end

  def index
    @regions = Region.all
  end

  def show
    @region = Region.find(params[:id])
  end

  def update
    @region = Region.find(params[:id])
    authorize! :update, @region
    @old_cluster_ids = @region.cluster_ids
    @old_language_ids = @region.language_ids
    @region.update(region_params)
    @region.lpf&.add_notification_channel(NotificationChannel.region_channel(@region))
    render :show
  end

  def destroy
    @region = Region.find(params[:id])
    authorize! :destroy, @region
    @region.destroy!
  end

  private

  def region_params
    params.require(:region).permit(:name, :lpf_id, cluster_ids: [], language_ids: [])
  end
end
