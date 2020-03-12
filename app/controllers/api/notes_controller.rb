# frozen_string_literal: true

class Api::NotesController < ApplicationController
  def create
    note_create = params.permit(:for_type, :for_id, :text).merge(person: current_user)
    @note = Note.create(note_create)
    render :show
  end

  def update
    @note = Note.find(params[:id])
    authorize! :update, @note
    note_update = params.permit(:text)
    @note.update(note_update)
    render :show
  end

  def destroy
    @note = Note.find(params[:id])
    authorize! :destroy, @note
    @note.destroy!
    response_ok
  end
end
