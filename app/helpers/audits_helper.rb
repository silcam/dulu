module AuditsHelper

  def audit_message(audit)
    user = audit.user
    m = user.full_name
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
          m+= audit.audited_changes.keys
                  .collect{ |k| "#{I18n.t(k, default: k)} to #{I18n.t(audit.audited_changes[k][1], default: audit.audited_changes[k][1])}"}
                  .join(', ')
          m[m.rindex(',')] = 'and' if m.include?(',')
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
        if audit.associated_type == 'Program'
          m += " for the #{Program.find(audit.associated_id).name} program."
        elsif audit.associated_type == 'Event'
          m += " for #{Event.find(audit.associated_id).name}."
        else
          m += '.'
        end
      when 'update'
        m += "updated a #{audit.auditable_type}"
        if audit.associated_type == 'Program'
          m += " for the #{Program.find(audit.associated_id).name} program."
        elsif audit.associated_type == 'Event'
          m += " for #{Event.find(audit.associated_id).name}."
        else
          m += '.'
        end
        m += " Params: #{audit.audited_changes}"
      when 'destroy'
        m += "deleted a #{audit.auditable_type}"
        if audit.associated_type == 'Program'
          m += " for the #{Program.find(audit.associated_id).name} program."
        elsif audit.associated_type == 'Event'
          m += " for #{Event.find(audit.associated_id).name}."
        else
          m += '.'
        end
    end
    m
  end
end