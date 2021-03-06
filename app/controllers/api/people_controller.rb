# frozen_string_literal: true

class Api::PeopleController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_view_prefs]

  def index
    @people = Person.all
  end

  def show
    @person = Person.find(params[:id])
  end

  def create
    authorize! :create, Person
    @person = Person.new(person_params)
    if duplicate_person?
      render :duplicate
    else
      @person.save!
      NotificationMailer.delay.welcome(@person, current_user) if @person.has_login
      render :show
    end
  end

  def update
    @person = Person.find(params[:id])
    authorize! :update, @person
    had_login = @person.has_login
    if @person.update(person_params)
      Notification.updated_person(current_user, @person)
      NotificationMailer.delay.welcome(@person, current_user) if !had_login && @person.has_login
    else
      @person.reload
    end
    render :show
  end

  def destroy
    @person = Person.find(params[:id])
    authorize! :destroy, @person
    @person.destroy!
  end

  def update_view_prefs
    params.permit!
    current_user.view_prefs.merge!(params[:view_prefs])
    current_user.save
    response_ok
  end

  def search
    @people = Person.basic_search(params[:q])
  end

  private

  def person_params
    fields = %i[first_name last_name gender email country_id ui_language email_pref notification_channels]
    fields << :has_login if can?(:grant_login, Person)
    params
      .require(:person)
      .permit(fields)
  end

  def duplicate_person?
    return false if params[:person][:not_a_duplicate]

    full_name = "#{@person.first_name} #{@person.last_name}"
    @poss_duplicates = Person.basic_search(full_name)
    names = full_name.downcase.split(/\s+/)
    @duplicates = @poss_duplicates.find_all do |person|
      p_names = person.full_name.downcase.split(/\s+/)
      names.count { |n| p_names.include?(n) } >= 2
    end
    !@duplicates.empty?
  end
end
