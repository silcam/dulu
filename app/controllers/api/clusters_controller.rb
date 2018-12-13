class Api::ClustersController < ApplicationController
  def index
    @clusters = Cluster.all
  end

  def dashboard
    @cluster = Cluster.find params[:id]
  end

  def search
    @clusters = Cluster.basic_search(params[:q])
  end
end