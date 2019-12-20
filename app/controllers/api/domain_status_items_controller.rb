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
    params
      .permit(
        :category,
        :subcategory,
        :year,
        :platforms,
        :description,
        :title,
        :count,
        :completeness,
        details: {},
        person_ids: [],
        organization_ids: [],
        bible_book_ids: []
      )
  end
end
