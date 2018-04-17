class Api::ClustersController < ApplicationController
  def dashboard
    @cluster = Cluster.find params[:id]
  end
end