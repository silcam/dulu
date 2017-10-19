module HasParticipants
  extend ActiveSupport::Concern

  def unassociated_people
    excludes = people.collect{ |p| p.id }
    Person.where.not(id: excludes)
  end

  def current_participants
    participants.where(end_date: nil)
  end

  def current_people
    people.joins(:participants).where(participants: {end_date: nil})
  end

  def current_organizations
    orgs = []
    current_participants.each do |participant|
      org = participant.person.organization
      orgs << org unless(org.nil? || orgs.include?(org))
    end
    orgs
  end
end