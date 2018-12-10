class Api::ClustersController < ApplicationController
  def dashboard
    @cluster = Cluster.find params[:id]
  end

  def search
    @clusters = Cluster.basic_search(params[:q])
  end
end