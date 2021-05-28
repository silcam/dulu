# frozen_string_literal: true

class Api::TagsController < ApplicationController
  def index
    @tags = Tag.all
  end

  def show
    @tag = Tag.find(params[:id])
  end

  def create
    authorize! :create, Tag
    @tag = Tag.new(tag_params)

    if is_duplicate?
      render :duplicate
    else
      @tag.save
      render :show
    end
  end

  def search
    @tags = Tag.search(params[:q])
  end

  # TODO, this doesn't actually work yet.
  def is_duplicate?
    r = Tag.where('tagname = ?', params[:name])
    if r.size >= 1
      return true
    else
      return false
    end
  end

  private

  def tag_params
    params.require(:tags).permit(:tagname)
  end
end
