module AuditsHelper

  def audit_message(audit)
    m = audit.user.full_name
    m2 = specific_audit_message(audit)
    m2 = generic_audit_message(audit) if m2.blank?
    "#{m} #{m2}"
  end

  def specific_audit_message(audit)
    if audit.auditable_type == 'Person'
      if audit.action == 'update'
        if audit.audited_changes.keys[0] == 'last_access'
          "logged in."
        elsif audit.user == Person.find(audit.auditable_id)
          m = "updated #{audit.user.gender == 'M' ? 'his' : 'her'} own "
          m += changelist(audit)
          m
        end
      end
    end
  end

  def generic_audit_message(audit)
    m = ''
    case audit.action
      when 'create'
        m += "added a new #{audit.auditable_type}"
        name = object_name(audited_object(audit))
        m += ", #{name}," unless name.blank?
        m += for_a_program_event_or_cluster(audit) + '.'

      when 'update'
        m += "updated #{indef_articlize(audit.auditable_type)}"
        name = object_name(audited_object(audit))
        m += ", #{name}," unless name.blank?
        m += for_a_program_event_or_cluster(audit)
        m += " changing #{changelist(audit)}."
      when 'destroy'
        m += "deleted #{indef_articlize(audit.auditable_type)}"
        m += for_a_program_event_or_cluster(audit) + '.'
    end
    m
  end

  def for_a_program_event_or_cluster(audit)
    object = audited_object(audit)
    if audit.associated_type == 'Program'
      return " for the #{Program.find(audit.associated_id).name} program"
    elsif audit.associated_type == 'Event'
      return " for the #{Event.find(audit.associated_id).name} event"
    elsif object.respond_to?(:cluster)
      cluster = object.cluster
      return " for the #{cluster.display_name}" unless cluster.nil?
    end
    ''
  end

  def audited_object(audit)
    audit.auditable_type.camelize.safe_constantize.try(:find_by, id: audit.auditable_id)
  end

  def changelist(audit)
    s = audit.audited_changes.keys
            .collect{ |k| "#{I18n.t(k, default: k)} to #{I18n.t(audit.audited_changes[k][1], default: audit.audited_changes[k][1])}"}
            .join(', ')
    s[s.rindex(',')] = 'and' if audit.audited_changes.count > 1
    s
  end

  def object_name(object)
    if object.respond_to?(:name)
      return object.name
    elsif object.respond_to?(:full_name)
      return object.full_name
    end
    ''
  end

  def indef_articlize(word)
    return word if word.blank?
    s = 'a'
    s += 'n' if %w[A E I O U a e i o u].include? word[0]
    s + ' ' + word
  end
end