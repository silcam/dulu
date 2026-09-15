# frozen_string_literal: true

class Api::NotesController < ApplicationController
  def create
    note_create = params.permit(:for_type, :for_id, :text).merge(person: current_user)
    @note = Note.new(note_create)
    # `for_type` is client input that Note#for will constantize, so an unknown one
    # is refused here rather than stored and dereferenced later. Note::FOR_TYPES
    # is the allowlist; the same validation also rejects a for_id that names
    # nothing. Create used to `render :show` unconditionally, which on a failed
    # save handed back a note with a nil id.
    return render plain: @note.errors.full_messages.join(', '), status: 422 unless @note.save

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
