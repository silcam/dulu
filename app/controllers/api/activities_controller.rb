# frozen_string_literal: true

class Api::ActivitiesController < ApplicationController
  def index
    @language = Language.find(params[:language_id])
    @activities = case params[:domain] 
                  when 'translation'
                    @language.translation_activities
                  when 'media'
                    @language.media_activities
                  when 'linguistic'
                    @language.linguistic_activities
                  else
                    @language.activities
                  end
  end

  def show
    @activity = Activity.find(params[:id])
  end

  def update
    @activity = Activity.find(params[:id])
    old_people = @activity.people.to_a
    authorize! :update, @activity
    @activity.update!(activity_params)
    @activity.reload
    notify(@activity, old_people)
    render :show
  end

  private

  def activity_params
    params.require(:activity).permit(participant_ids: [])
  end

  def notify(activity, old_people)
    new_people = activity.people - old_people
    Notification.added_people_to_activity(current_user, new_people, activity) unless new_people.empty?
  end
end
