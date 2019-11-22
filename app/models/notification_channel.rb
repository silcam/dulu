# frozen_string_literal: true

class NotificationChannel
  class << self
    def language_channel(id)
      "Lng#{id} "
    end

    def cluster_channel(id)
      "Cls#{id} "
    end

    def region_channel(id)
      "Reg#{id} "
    end

    def domain_channel(domain)
      case domain.downcase.to_sym
      when :translation
        return 'DTra '
      when :linguistics
        return 'DLng '
      when :literacy
        return 'DLit '
      when :scripture_use || :media
        return 'DScr '
      end
      throw "Could not convert domain [#{domain}] into a notification channel."
    end

    def supported_domain?(domain)
      domain_channel(domain)
      true
    rescue StandardError
      false
    end

    def add_channel(channels, channel)
      channels.include?(channel) ? channels : channels + channel
    end

    def remove_channel(channels, channel)
      channels.gsub(channel, '')
    end

    def people_for_channels(channels)
      query = channels.map { 'notification_channels LIKE ?' }.join(' OR ')
      subs = channels.map { |c| "%#{c}%" }
      Person.where(query, *subs)
    end

    def people_for_language(language)
      region = language.get_lpf
      channels = [language_channel(language.id)]
      channels << cluster_channel(language.cluster_id) if language.cluster_id
      channels << region_channel(region.id) if region
      people_for_channels(channels)
    end

    def people_for_cluster(cluster)
      channels = [cluster_channel(cluster.id)]
      channels += cluster.language_ids.map { |id| language_channel(id) }
      channels << region_channel(cluster.lpf_id) if cluster.lpf_id
      people_for_channels(channels)
    end

    def people_for_domain(domain)
      people_for_domains [domain]
    end

    def people_for_domains(domains)
      domains
        .map do |domain|
          supported_domain?(domain) ? people_for_channels([domain_channel(domain)]) : []
        end
        .flatten
    end
  end
end
