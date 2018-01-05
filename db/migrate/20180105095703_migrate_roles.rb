class MigrateRoles < ActiveRecord::Migration[5.0]
  def up
    add_column :people, :has_login, :boolean, default: false

    Person.all.each do |person|
      person.has_login = true if person.role
      person.add_role(:Administration) if person.role_program_admin
      person.add_role(:DuluAdmin) if person.role_site_admin
      person.save!
    end

    Participant.all.each do |participant|
      update_participant_role participant
    end

    EventParticipant.all.each do |participant|
      update_participant_role participant
    end
  end

  def update_participant_role(participant)
    return unless participant.program_role
    person = participant.person
    role = participant.program_role.name
    unless person.has_role? role
      person.add_role role
    end
    participant.add_role role
  end

  def down
    remove_column :people, :has_login
  end
end
