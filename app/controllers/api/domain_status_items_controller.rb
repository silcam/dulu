# frozen_string_literal: true

class Api::DomainStatusItemsController < ApplicationController
  def create
    @language = Language.find(params[:language_id])
    authorize! :update, @language
    @dsi = @language.domain_status_items.create!(dsi_params.merge(creator: current_user))
    render :index
  end

  def index
    @language = Language.find(params[:language_id])
  end

  def update
    @dsi = DomainStatusItem.find(params[:id])
    @language = @dsi.language
    authorize! :update, @language
    @dsi.update!(dsi_params)
    render :index
  end

  def destroy
    @dsi = DomainStatusItem.find(params[:id])
    @language = @dsi.language
    authorize! :update, @language
    @dsi.destroy
    render :index
  end

  private

  def dsi_params
    base_params = params
                  .permit(
                    :category,
                    :subcategory,
                    :year,
                    :platforms,
                    :description,
                    :title,
                    :count,
                    :completeness,
                    :link,
                    :dsi_location_id,
                    details: {},
                    person_ids: [],
                    organization_ids: [],
                    bible_book_ids: []
                  )
    if params[:new_dsi_location]
      dsi_location = DsiLocation.create!(name: params[:new_dsi_location])
      base_params[:dsi_location] = dsi_location
    end
    base_params
  end
end
